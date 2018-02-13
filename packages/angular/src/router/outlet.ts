import {
  Attribute,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Injector,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Type,
  ViewContainerRef,
} from '@angular/core';

import {
  PRIMARY_OUTLET,
  ActivatedRoute,
  ChildrenOutletContexts,
  Router
} from '@angular/router';

import { NavResult, RouterDelegate } from '@ionic/core';

import { OutletInjector } from './outlet-injector';
import { RouteEventHandler } from './route-event-handler';

import { AngularComponentMounter, AngularEscapeHatch } from '..';

let id = 0;

@Directive({
  selector: 'ion-nav',
})
export class RouterOutlet implements OnDestroy, OnInit, RouterDelegate {

  public name: string;
  public activationStatus = NOT_ACTIVATED;
  public componentConstructor: Type<any> = null;
  public componentInstance: any = null;
  public activatedRoute: ActivatedRoute = null;
  public activatedRouteData: any = {};
  public activeComponentRef: ComponentRef<any> = null;
  private id: number = id++;

  @Output('activate') activateEvents = new EventEmitter<any>();
  @Output('deactivate') deactivateEvents = new EventEmitter<any>();

  constructor(
    public location: ViewContainerRef,
    public changeDetector: ChangeDetectorRef,
    public elementRef: ElementRef,
    protected angularComponentMounter: AngularComponentMounter,
    protected parentContexts: ChildrenOutletContexts,
    protected cfr: ComponentFactoryResolver,
    protected injector: Injector,
    protected router: Router,
    private routeEventHandler: RouteEventHandler,
    @Attribute('name') name: string) {

    (this.elementRef.nativeElement as HTMLIonNavElement).routerDelegate = this;
    this.name = name || PRIMARY_OUTLET;
    parentContexts.onChildOutletCreated(this.name, this as any);
  }

  pushUrlState(urlSegment: string): Promise<any> {
    return this.router.navigateByUrl(urlSegment);
  }

  popUrlState(): Promise<any> {
    window.history.back();
    return Promise.resolve();
  }

  ngOnDestroy(): void {
    console.debug(`Nav ${this.id} ngOnDestroy`);
    this.parentContexts.onChildOutletDestroyed(this.name);
  }

  get isActivated(): boolean {
    return this.activationStatus === ACTIVATION_IN_PROGRESS
      || this.activationStatus === ACTIVATED;
  }

  ngOnInit(): void {
    if (!this.isActivated) {
      // If the outlet was not instantiated at the time the route got activated we need to populate
      // the outlet when it is initialized (ie inside a NgIf)
      const context = this.parentContexts.getContext(this.name);
      if (context && context.route) {
        // the component defined in the configuration is created
        // otherwise the component defined in the configuration is created
        this.activateWith(context.route, context.resolver || null);
      }
    }
  }

  get component(): Object {
    return this.componentInstance;
  }

  deactivate(): void {
    console.debug(`outlet ${this.id} is being deactivated`);
    this.activationStatus = NOT_ACTIVATED;
    this.deactivateEvents.emit(this.componentConstructor);
  }

  activateWith(activatedRoute: ActivatedRoute, cfr: ComponentFactoryResolver): Promise<void> {
    this.routeEventHandler.externalNavStart();
    if (this.activationStatus !== NOT_ACTIVATED) {
      return Promise.resolve();
    }

    this.activationStatus = ACTIVATION_IN_PROGRESS;
    this.activatedRoute = activatedRoute;
    const snapshot = (activatedRoute as any)._futureSnapshot;
    const component = snapshot.routeConfig ? snapshot.routeConfig.component : null;
    cfr = cfr || this.cfr;
    const childContexts = this.parentContexts.getOrCreateContext(this.name).children;
    const injector = new OutletInjector(activatedRoute, childContexts, this.location.injector);

    const isTopLevel = !hasChildComponent(activatedRoute);
    return activateRoute(this.elementRef.nativeElement, component, cfr, injector, isTopLevel).then(() => {
      this.changeDetector.markForCheck();
      this.activateEvents.emit(null);
      this.activationStatus = ACTIVATED;
    });
  }
}

export function activateRoute(navElement: HTMLIonNavElement,
  component: Type<any>, cfr: ComponentFactoryResolver, injector: Injector, isTopLevel: boolean): Promise<void> {

  return navElement.componentOnReady().then(() => {

    // check if the nav has an `<ion-tab>` as a parent
    if (isParentTab(navElement)) {
      // check if the tab is selected
      return updateTab(navElement, component, cfr, injector, isTopLevel);
    } else {
      return updateNav(navElement, component, cfr, injector, isTopLevel);
    }
  });
}



function isParentTab(navElement: HTMLIonNavElement) {
  return navElement.parentElement.tagName.toLowerCase() === 'ion-tab';
}

function isTabSelected(tabsElement: HTMLIonTabsElement, tabElement: HTMLIonTabElement ): Promise<boolean> {
  const promises: Promise<any>[] = [];
  promises.push(tabsElement.componentOnReady());
  promises.push(tabElement.componentOnReady());
  return Promise.all(promises).then(() => {
    return tabsElement.getSelected() === tabElement;
  });
}

function getSelected(tabsElement: HTMLIonTabsElement) {
  tabsElement.getSelected();
}

function updateTab(navElement: HTMLIonNavElement,
  component: Type<any>, cfr: ComponentFactoryResolver, injector: Injector, isTopLevel: boolean) {

  const tab = navElement.parentElement as HTMLIonTabElement;
  // tab.externalNav = true;

  // (tab.parentElement as HTMLIonTabsElement).externalInitialize = true;
  // yeah yeah, I know this is kind of ugly but oh well, I know the internal structure of <ion-tabs>
  const tabs = tab.parentElement.parentElement as HTMLIonTabsElement;
  // tabs.externalInitialize = true;
  return isTabSelected(tabs, tab).then((isSelected: boolean) => {
    if (!isSelected) {
      const promise = updateNav(navElement, component, cfr, injector, isTopLevel);
      (window as any).externalNavPromise = promise
      // okay, the tab is not selected, so we need to do a "switch" transition
      // basically, we should update the nav, and then swap the tabs
      return promise.then(() => {
        return tabs.select(tab);
      });
    }

    // okay cool, the tab is already selected, so we want to see a transition
    return updateNav(navElement, component, cfr, injector, isTopLevel);
  })
}

function updateNav(navElement: HTMLIonNavElement,
  component: Type<any>, cfr: ComponentFactoryResolver, injector: Injector, isTopLevel: boolean): Promise<NavResult> {

  const escapeHatch = getEscapeHatch(cfr, injector);

  // check if the component is the top view
  const activeViews = navElement.getViews();
  if (activeViews.length === 0) {
    // there isn't a view in the stack, so push one
    return navElement.setRoot(component, {}, {}, escapeHatch);
  }

  const currentView = activeViews[activeViews.length - 1];
  if (currentView.component === component) {
    // the top view is already the component being activated, so there is no change needed
    return Promise.resolve(null);
  }

  // check if the component is the previous view, if so, pop back to it
  if (activeViews.length > 1) {
    // there's at least two views in the stack
    const previousView = activeViews[activeViews.length - 2];
    if (previousView.component === component) {
      // cool, we match the previous view, so pop it
      return navElement.pop(null, escapeHatch);
    }
  }

  // check if the component is already in the stack of views, in which case we pop back to it
  for (const view of activeViews) {
    if (view.component === component) {
      // cool, we found the match, pop back to that bad boy
      return navElement.popTo(view, null, escapeHatch);
    }
  }

  // it's the top level nav, and it's not one of those other behaviors, so do a push so the user gets a chill animation
  return navElement.push(component, {}, { animate: isTopLevel }, escapeHatch);
}

export const NOT_ACTIVATED = 0;
export const ACTIVATION_IN_PROGRESS = 1;
export const ACTIVATED = 2;

export function hasChildComponent(activatedRoute: ActivatedRoute): boolean {
  // don't worry about recursion for now, that's a future problem that may or may not manifest itself
  for (const childRoute of activatedRoute.children) {
    if (childRoute.component) {
      return true;
    }
  }
  return false;
}

export function getEscapeHatch(cfr: ComponentFactoryResolver, injector: Injector): AngularEscapeHatch {
  return {
    cfr,
    injector,
    fromExternalRouter: true,
    url: location.pathname
  };
}
