import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Config, QueueController } from '../../index';
import { flattenRouterTree, readRedirects, readRoutes } from './utils/parser';
import { readNavState, writeNavState } from './utils/dom';
import { chainToPath, generatePath, parsePath, readPath, writePath } from './utils/path';
import { RouteChain, RouteRedirect, RouterDirection, RouterEventDetail } from './utils/interfaces';
import { routeRedirect, routerIDsToChain, routerPathToChain } from './utils/matching';

@Component({
  tag: 'ion-router'
})
export class Router {

  private routes: RouteChain[];
  private previousPath: string|null = null;
  private redirects: RouteRedirect[];
  private busy = false;
  private init = false;
  private state = 0;
  private lastState = 0;
  private timer: any;

  @Element() el: HTMLElement;

  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'queue' }) queue: QueueController;

  @Prop() base = '';
  @Prop() useHash = true;

  @Event() ionRouteChanged: EventEmitter<RouterEventDetail>;

  componentDidLoad() {
    this.init = true;
    console.debug('[ion-router] router did load');

    const tree = readRoutes(this.el);
    this.routes = flattenRouterTree(tree);
    this.redirects = readRedirects(this.el);

    // TODO: use something else
    requestAnimationFrame(() => {
      this.historyDirection();
      this.writeNavStateRoot(this.getPath(), RouterDirection.None);
    });
  }

  @Listen('ionRouteRedirectChanged')
  protected onRedirectChanged(ev: CustomEvent) {
    if (!this.init) {
      return;
    }
    console.debug('[ion-router] redirect data changed', ev.target);
    this.redirects = readRedirects(this.el);
  }

  @Listen('ionRouteDataChanged')
  protected onRoutesChanged(ev: CustomEvent) {
    if (!this.init) {
      return;
    }
    console.debug('[ion-router] route data changed', ev.target, ev.detail);

    // schedule write
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    this.timer = setTimeout(() => {
      console.debug('[ion-router] data changed -> update nav');
      const tree = readRoutes(this.el);
      this.routes = flattenRouterTree(tree);
      this.writeNavStateRoot(this.getPath(), RouterDirection.None);
      this.timer = undefined;
    }, 100);
  }

  @Listen('window:popstate')
  protected onPopState() {
    const direction = this.historyDirection();
    const path = this.getPath();
    console.debug('[ion-router] URL changed -> update nav', path, direction);
    return this.writeNavStateRoot(path, direction);
  }

  private historyDirection() {
    if (window.history.state === null) {
      this.state++;
      window.history.replaceState(this.state, document.title, document.location.href);
    }

    const state = window.history.state;
    const lastState = this.lastState;
    this.lastState = state;

    if (state > lastState) {
      return RouterDirection.Forward;
    } else if (state < lastState) {
      return RouterDirection.Back;
    } else {
      return RouterDirection.None;
    }
  }

  @Method()
  async navChanged(direction: RouterDirection): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    const { ids, outlet } = readNavState(document.body);
    const chain = routerIDsToChain(ids, this.routes);
    if (!chain) {
      console.warn('[ion-router] no matching URL for ', ids.map(i => i.id));
      return false;
    }

    const path = chainToPath(chain);
    if (!path) {
      console.warn('[ion-router] router could not match path because some required param is missing');
      return false;
    }

    console.debug('[ion-router] nav changed -> update URL', ids, path);
    this.setPath(path, direction);
    if (outlet) {
      console.debug('[ion-router] updating nested outlet', outlet);
      await this.writeNavState(outlet, chain, RouterDirection.None, ids.length);
    }
    this.emitRouteChange(path, null);
    return true;
  }

  @Method()
  push(url: string, direction = RouterDirection.Forward) {
    const path = parsePath(url);
    this.setPath(path, direction);

    console.debug('[ion-router] URL pushed -> updating nav', url, direction);
    return this.writeNavStateRoot(path, direction);
  }

  private async writeNavStateRoot(path: string[]|null, direction: RouterDirection): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    if (!path) {
      console.error('[ion-router] URL is not part of the routing set');
      return false;
    }
    const redirect = routeRedirect(path, this.redirects);
    let redirectFrom: string[]|null = null;
    if (redirect) {
      this.setPath(redirect.to!, direction);
      redirectFrom = redirect.from;
      path = redirect.to!;
    }
    const chain = routerPathToChain(path, this.routes);
    const changed = await this.writeNavState(document.body, chain, direction);
    if (changed) {
      this.emitRouteChange(path, redirectFrom);
    }
    return changed;
  }

  private async writeNavState(node: any, chain: RouteChain | null, direction: RouterDirection, index = 0): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    this.busy = true;
    const changed = await writeNavState(node, chain, direction, index);
    this.busy = false;
    return changed;
  }

  private setPath(path: string[], direction: RouterDirection) {
    this.state++;
    writePath(window.history, this.base, this.useHash, path, direction, this.state);
  }

  private getPath(): string[] | null {
    return readPath(window.location, this.base, this.useHash);
  }

  private emitRouteChange(path: string[], redirectPath: string[]|null) {
    console.debug('[ion-router] route changed', path);
    const from = this.previousPath;
    const redirectedFrom = redirectPath ? generatePath(redirectPath) : null;
    const to = generatePath(path);
    this.previousPath = to;
    this.ionRouteChanged.emit({
      from,
      redirectedFrom,
      to: to
    });
  }
}
