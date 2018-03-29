import { ComponentRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from './ion-nav-controller';
import { NavDirection } from '@ionic/core';


export class StackController {

  private viewsSnapshot: RouteView[] = [];
  private views: RouteView[] = [];

  constructor(
    private stack: boolean,
    private containerEl: HTMLIonRouterOutletElement,
    private router: Router,
    private navCtrl: NavController,
  ) {}

  createView(enteringRef: ComponentRef<any>, route: ActivatedRoute): RouteView {
    return {
      ref: enteringRef,
      element: (enteringRef && enteringRef.location && enteringRef.location.nativeElement) as HTMLElement,
      url: this.getUrl(route),
      deactivatedId: -1
    };
  }

  getExistingView(activatedRoute: ActivatedRoute): RouteView|null {
    const activatedUrlKey = this.getUrl(activatedRoute);
    return this.views.find(vw => vw.url === activatedUrlKey);
  }

  canGoBack(deep: number): boolean {
    return this.views.length > deep;
  }

  async setActive(enteringView: RouteView, direction: number | undefined) {
    const leavingView = this.getActive();
    const reused = this.insertView(enteringView);
    direction = direction != null ? direction : (reused ? -1 : 1);
    await this.transition(enteringView, leavingView, direction, this.canGoBack(1));

    this.cleanup();
  }

  pop(deep: number) {
    const view = this.views[this.views.length - deep - 1];
    this.navCtrl.setGoback();
    this.router.navigateByUrl(view.url);
  }

  private insertView(enteringView: RouteView): boolean {
    if (this.stack) {
      const index = this.views.indexOf(enteringView);
      if (index >= 0) {
        this.views = this.views.slice(0, index + 1);
        return true;
      } else {
        this.views.push(enteringView);
        return false;
      }
    } else {
      this.views = [enteringView];
      return false;
    }
  }

  private cleanup() {
    this.viewsSnapshot
      .filter(view => !this.views.includes(view))
      .forEach(view => destroyView(view));

    for (let i = 0; i < this.views.length - 1; i++) {
      this.views[i].element.hidden = true;
    }
    this.viewsSnapshot = this.views.slice();
  }

  getActive(): RouteView | null {
    return this.views.length > 0 ? this.views[this.views.length - 1] : null;
  }

  private async transition(enteringView: RouteView, leavingView: RouteView, direction: number, showGoBack: boolean) {
    const enteringEl = enteringView ? enteringView.element : undefined;
    const leavingEl = leavingView ? leavingView.element : undefined;
    const containerEl = this.containerEl;
    if (enteringEl) {
      enteringEl.classList.add('ion-page', 'hide-page');
      containerEl.appendChild(enteringEl);

      await containerEl.componentOnReady();
      await containerEl.commit(enteringEl, leavingEl, {
        duration: direction === 0 ? 0 : undefined,
        direction: direction === -1 ? NavDirection.Back : NavDirection.Forward,
        showGoBack
      });
    }
  }

  private getUrl(activatedRoute: ActivatedRoute) {
    const urlTree = this.router.createUrlTree(['.'], { relativeTo: activatedRoute });
    return this.router.serializeUrl(urlTree);
  }

}

export function destroyView(view: RouteView) {
  if (view) {
    // TODO lifecycle event
    view.ref.destroy();
  }
}

export function getLastDeactivatedRef(views: RouteView[]) {
  if (views.length < 2) {
    return null;
  }

  return views.sort((a, b) => {
    if (a.deactivatedId > b.deactivatedId) return -1;
    if (a.deactivatedId < b.deactivatedId) return 1;
    return 0;
  })[0].ref;
}

export interface RouteView {
  url: string;
  element: HTMLElement;
  ref: ComponentRef<any>;
  deactivatedId: number;
}
