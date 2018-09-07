import { Component, Element, Event, EventEmitter, Method, Prop, Watch } from '@stencil/core';

import { Mode } from '../../interface.js';

import { Swiper } from './vendor/swiper.js';

@Component({
  tag: 'ion-slides',
  styleUrls: {
    ios: 'slides.ios.scss',
    md: 'slides.md.scss'
  },
  assetsDir: 'vendor',
  shadow: true
})
export class Slides {

  private container!: HTMLElement;
  private swiper: any;

  mode!: Mode;

  @Element() el!: HTMLStencilElement;

  /**
   * Emitted after Swiper initialization
   */
  @Event() ionSlidesDidLoad!: EventEmitter;

  /**
   * Emitted when the user taps/clicks on the slide's container.
   */
  @Event() ionSlideTap!: EventEmitter;

  /**
   * Emitted when the user double taps on the slide's container.
   */
  @Event() ionSlideDoubleTap!: EventEmitter;

  /**
   * Emitted before the active slide has changed.
   */
  @Event() ionSlideWillChange!: EventEmitter;

  /**
   * Emitted after the active slide has changed.
   */
  @Event() ionSlideDidChange!: EventEmitter;

  /**
   * Emitted when the next slide has started.
   */
  @Event() ionSlideNextStart!: EventEmitter;

  /**
   * Emitted when the previous slide has started.
   */
  @Event() ionSlidePrevStart!: EventEmitter;

  /**
   * Emitted when the next slide has ended.
   */
  @Event() ionSlideNextEnd!: EventEmitter;

  /**
   * Emitted when the previous slide has ended.
   */
  @Event() ionSlidePrevEnd!: EventEmitter;

  /**
   * Emitted when the slide transition has started.
   */
  @Event() ionSlideTransitionStart!: EventEmitter;

  /**
   * Emitted when the slide transition has ended.
   */
  @Event() ionSlideTransitionEnd!: EventEmitter;

  /**
   * Emitted when the slider is actively being moved.
   */
  @Event() ionSlideDrag!: EventEmitter;

  /**
   * Emitted when the slider is at its initial position.
   */
  @Event() ionSlideReachStart!: EventEmitter;

  /**
   * Emitted when the slider is at the last slide.
   */
  @Event() ionSlideReachEnd!: EventEmitter;

  /**
   * Emitted when the user first touches the slider.
   */
  @Event() ionSlideTouchStart!: EventEmitter;

  /**
   * Emitted when the user releases the touch.
   */
  @Event() ionSlideTouchEnd!: EventEmitter;

  /**
   * Options to pass to the swiper instance.
   * See http://idangero.us/swiper/api/ for valid options
   */
  @Prop() options: any; // SwiperOptions;  // TODO

  @Watch('options')
  updateSwiperOptions() {
    const newOptions = this.normalizeOptions();
    this.swiper.params = { ...this.swiper.params, ...newOptions };
    this.update();
  }

  /**
   * If true, show the pagination. Defaults to `false`.
   */
  @Prop() pager = false;

  /**
   * If true, show the scrollbar. Defaults to `false`.
   */
  @Prop() scrollbar = false;

  componentDidLoad() {
    setTimeout(this.initSlides.bind(this), 10);
  }

  componentDidUnload() {
    this.swiper.destroy(true, true);
  }

  private initSlides() {
    this.container = (this.el.shadowRoot || this.el).querySelector('.swiper-container') as HTMLElement;
    const finalOptions = this.normalizeOptions();
    // init swiper core
    this.swiper = new Swiper(this.container, finalOptions);
  }

  /**
   * Update the underlying slider implementation. Call this if you've added or removed
   * child slides.
   */
  @Method()
  update() {
    this.swiper.update();
  }

  /**
   * Transition to the specified slide.
   */
  @Method()
  slideTo(index: number, speed?: number, runCallbacks?: boolean) {
    this.swiper.slideTo(index, speed, runCallbacks);
  }

  /**
   * Transition to the next slide.
   */
  @Method()
  slideNext(speed?: number, runCallbacks?: boolean) {
    this.swiper.slideNext(speed, runCallbacks);
  }

  /**
   * Transition to the previous slide.
   */
  @Method()
  slidePrev(speed?: number, runCallbacks?: boolean) {
    this.swiper.slidePrev(speed, runCallbacks);
  }

  /**
   * Get the index of the active slide.
   */
  @Method()
  getActiveIndex(): Promise<number> {
    return Promise.resolve(this.swiper.activeIndex);
  }

  /**
   * Get the index of the previous slide.
   */
  @Method()
  getPreviousIndex(): Promise<number> {
    return Promise.resolve(this.swiper.previousIndex);
  }

  /**
   * Get the total number of slides.
   */
  @Method()
  length(): Promise<number> {
    return Promise.resolve(this.swiper.slides.length);
  }

  /**
   * Get whether or not the current slide is the last slide.
   *
   */
  @Method()
  isEnd(): Promise<boolean> {
    return Promise.resolve(this.swiper.isEnd);
  }

  /**
   * Get whether or not the current slide is the first slide.
   */
  @Method()
  isBeginning(): Promise<boolean> {
    return Promise.resolve(this.swiper.isBeginning);
  }

  /**
   * Start auto play.
   */
  @Method()
  startAutoplay() {
    this.swiper.autoplay.start();
  }

  /**
   * Stop auto play.
   */
  @Method()
  stopAutoplay() {
    this.swiper.autoplay.stop();
  }

  /**
   * Lock or unlock the ability to slide to the next slides.
   */
  @Method()
  lockSwipeToNext(shouldLockSwipeToNext: boolean) {
    this.swiper.allowSlideNext = !shouldLockSwipeToNext;
  }

  /**
   * Lock or unlock the ability to slide to the previous slides.
   */
  @Method()
  lockSwipeToPrev(shouldLockSwipeToPrev: boolean) {
    this.swiper.allowSlidePrev = !shouldLockSwipeToPrev;
  }

  /**
   * Lock or unlock the ability to slide to change slides.
   */
  @Method()
  lockSwipes(shouldLockSwipes: boolean) {
    this.swiper.allowSlideNext = !shouldLockSwipes;
    this.swiper.allowSlidePrev = !shouldLockSwipes;
    this.swiper.allowTouchMove = !shouldLockSwipes;
  }

  private normalizeOptions() {
    // Base options, can be changed
    const swiperOptions = {
      effect: 'slide',
      direction: 'horizontal',
      initialSlide: 0,
      loop: false,
      pager: false,
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      },
      parallax: false,
      scrollbar: {
        el: this.scrollbar ? '.swiper-scrollbar' : null,
        hide: true,
      },
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 300,
      zoom: false,
      slidesPerColumn: 1,
      slidesPerColumnFill: 'column',
      slidesPerGroup: 1,
      centeredSlides: false,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
      touchEventsTarget: 'container',
      autoplayDisableOnInteraction: true,
      autoplayStopOnLast: false,
      freeMode: false,
      freeModeMomentum: true,
      freeModeMomentumRatio: 1,
      freeModeMomentumBounce: true,
      freeModeMomentumBounceRatio: 1,
      freeModeMomentumVelocityRatio: 1,
      freeModeSticky: false,
      freeModeMinimumVelocity: 0.02,
      autoHeight: false,
      setWrapperSize: false,
      zoomMax: 3,
      zoomMin: 1,
      zoomToggle: true,
      touchRatio: 1,
      touchAngle: 45,
      simulateTouch: true,
      shortSwipes: true,
      longSwipes: true,
      longSwipesRatio: 0.5,
      longSwipesMs: 300,
      followFinger: true,
      onlyExternal: false,
      threshold: 0,
      touchMoveStopPropagation: true,
      touchReleaseOnEdges: false,
      iOSEdgeSwipeDetection: false,
      iOSEdgeSwipeThreshold: 20,
      paginationClickable: false,
      paginationHide: false,
      resistance: true,
      resistanceRatio: 0.85,
      watchSlidesProgress: false,
      watchSlidesVisibility: false,
      preventClicks: true,
      preventClicksPropagation: true,
      slideToClickedSlide: false,
      loopAdditionalSlides: 0,
      noSwiping: true,
      runCallbacksOnInit: true,
      controlBy: 'slide',
      controlInverse: false,
      coverflow: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
      },
      flip: {
        slideShadows: true,
        limitRotation: true
      },
      cube: {
        slideShadows: true,
        shadow: true,
        shadowOffset: 20,
        shadowScale: 0.94
      },
      fade: {
        crossFade: false
      },
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
      firstSlideMessage: 'This is the first slide',
      lastSlideMessage: 'This is the last slide'
    };

    // Keep the event options separate, we dont want users
    // overwriting these
    const eventOptions = {
      on: {
        init: () => {
          setTimeout(() => {
            this.ionSlidesDidLoad.emit();
          }, 20);
        },
        slideChangeTransitionStart: this.ionSlideWillChange.emit,
        slideChangeTransitionEnd: this.ionSlideDidChange.emit,
        slideNextTransitionStart: this.ionSlideNextStart.emit,
        slidePrevTransitionStart: this.ionSlidePrevStart.emit,
        slideNextTransitionEnd: this.ionSlideNextEnd.emit,
        slidePrevTransitionEnd: this.ionSlidePrevEnd.emit,
        transitionStart: this.ionSlideTransitionStart.emit,
        transitionEnd: this.ionSlideTransitionEnd.emit,
        sliderMove: this.ionSlideDrag.emit,
        reachBeginning: this.ionSlideReachStart.emit,
        reachEnd: this.ionSlideReachEnd.emit,
        touchStart: this.ionSlideTouchStart.emit,
        touchEnd: this.ionSlideTouchEnd.emit,
        tap: this.ionSlideTap.emit,
        doubleTap: this.ionSlideDoubleTap.emit
      }
    };

    // Merge the base, user options, and events together then pas to swiper
    return { ...swiperOptions, ...this.options, ...eventOptions };
  }

  render() {
    return (
      <div class="swiper-container" ref={el => this.container = el as HTMLElement}>
        <div class="swiper-wrapper">
          <slot></slot>
        </div>
        {this.pager ? <div class="swiper-pagination"></div> : null}
        {this.scrollbar ? <div class="swiper-scrollbar"></div> : null}
      </div>
    );
  }
}
