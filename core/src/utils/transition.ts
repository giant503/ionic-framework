import { Animation, AnimationBuilder } from '../';
import { NavDirection } from '../components/nav/nav-util';

export let MyCustomEvent = CustomEvent;

export async function transition(opts: AnimationOptions): Promise<Animation|null> {
  beforeTransition(opts);

  return (opts.enteringEl && (opts.animationBuilder || opts.animation))
    ? animation(opts)
    : noAnimation(opts); // fast path for no animation
}

function beforeTransition(opts: AnimationOptions) {
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  setZIndex(enteringEl, leavingEl, opts.direction);

  if (enteringEl) {
    if (opts.showGoBack) {
      enteringEl.classList.add('can-go-back');
    } else {
      enteringEl.classList.remove('can-go-back');
    }
    enteringEl.hidden = false;
  }
  if (leavingEl) {
    leavingEl.hidden = false;
  }
}

async function animation(opts: AnimationOptions): Promise<Animation> {
  await waitDeepReady(opts);

  const transition = await createTransition(opts);
  fireWillEvents(opts.enteringEl, opts.leavingEl);
  await playTransition(transition, opts);

  if (transition.hasCompleted) {
    fireDidEvents(opts.enteringEl, opts.leavingEl);
  }
  return transition;
}

async function noAnimation(opts: AnimationOptions): Promise<null> {
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  enteringEl && enteringEl.classList.remove('hide-page');
  leavingEl && leavingEl.classList.remove('hide-page');

  await waitShallowReady(opts);

  fireWillEvents(enteringEl, leavingEl);
  fireDidEvents(enteringEl, leavingEl);
  return undefined;
}

async function waitDeepReady(opts: AnimationOptions) {
  await Promise.all([
    deepReady(opts.enteringEl),
    deepReady(opts.leavingEl)
  ]);
  await notifyViewReady(opts.viewIsReady, opts.enteringEl);
}

async function waitShallowReady(opts: AnimationOptions) {
  await Promise.all([
    shallowReady(opts.enteringEl),
    shallowReady(opts.leavingEl)
  ]);
  await notifyViewReady(opts.viewIsReady, opts.enteringEl);
}

async function notifyViewReady(viewIsReady: undefined | ((enteringEl: HTMLElement) => Promise<any>), enteringEl: HTMLElement) {
  if (viewIsReady) {
    await viewIsReady(enteringEl);
  }
}

function createTransition(opts: AnimationOptions) {
  if (opts.animation) {
    return opts.animation;
  }
  return opts.animationCtrl.create(opts.animationBuilder, opts.baseEl, opts);
}

function playTransition(transition: Animation, opts: AnimationOptions): Promise<Animation> {
  const progressAnimation = opts.progressAnimation;
  const promise = new Promise<Animation>(resolve => transition.onFinish(resolve));

  // cool, let's do this, start the transition
  if (progressAnimation) {
    // this is a swipe to go back, just get the transition progress ready
    // kick off the swipe animation start
    transition.progressStart();
    progressAnimation(transition);

  } else {
    // only the top level transition should actually start "play"
    // kick it off and let it play through
    // ******** DOM WRITE ****************
    transition.play();
  }
  // create a callback for when the animation is done
  return promise;
}

function fireWillEvents(enteringEl: HTMLElement, leavingEl: HTMLElement) {
  lifecycle(leavingEl, ViewLifecycle.WillLeave);
  lifecycle(enteringEl, ViewLifecycle.WillEnter);
}

function fireDidEvents(enteringEl: HTMLElement, leavingEl: HTMLElement) {
  lifecycle(enteringEl, ViewLifecycle.DidEnter);
  lifecycle(leavingEl, ViewLifecycle.DidLeave);
}

export function lifecycle(el: HTMLElement, lifecycle: ViewLifecycle) {
  if (el) {
    const event = new MyCustomEvent(lifecycle, {
      bubbles: false,
      cancelable: false
    });
    el.dispatchEvent(event);
  }
}

export function mockLifecycle(fn: any) {
  MyCustomEvent = fn;
}

function shallowReady(el: Element): Promise<any> {
  if (el && (el as any).componentOnReady) {
    return (el as any).componentOnReady();
  }
  return Promise.resolve();
}

function deepReady(el: Element): Promise<any> {
  if (!el) {
    return Promise.resolve();
  }
  if ((el as any).componentOnReady) {
    return (el as any).componentOnReady();
  } else {
    return Promise.all(Array.from(el.children).map(deepReady));
  }
}

function setZIndex(enteringEl: HTMLElement, leavingEl: HTMLElement, direction: NavDirection) {
  if (enteringEl) {
    enteringEl.style.zIndex = (direction === NavDirection.Back)
      ? '99'
      : '101';
  }
  if (leavingEl) {
    leavingEl.style.zIndex = '100';
  }
}

export const enum ViewLifecycle {
  WillEnter = 'ionViewWillEnter',
  DidEnter = 'ionViewDidEnter',
  WillLeave = 'ionViewWillLeave',
  DidLeave = 'ionViewDidLeave',
  WillUnload = 'ionViewWillUnload'
}

export interface AnimationOptions {
  animationCtrl: HTMLIonAnimationControllerElement;
  animationBuilder: AnimationBuilder;
  animation?: Animation;
  direction?: NavDirection;
  duration?: number;
  easing?: string;
  viewIsReady?: (enteringEl: HTMLElement) => Promise<any>;
  showGoBack?: boolean;
  progressAnimation?: Function;
  enteringEl: HTMLElement;
  leavingEl: HTMLElement;
  baseEl: HTMLElement;
}
