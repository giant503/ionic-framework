import {Transition} from './transition';
import {Animation} from '../animations/animation';


const DURATION = 550;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';

const OPACITY = 'opacity';
const TRANSLATEX = 'translateX';

const OFF_LEFT = '-33%';
const CENTER = '0%'
const OFF_OPACITY = 0.8;


class IOSTransition extends Transition {

  constructor(nav, opts) {
    super(nav, opts);

    // global duration and easing for all child animations
    this.duration(DURATION);
    this.easing(EASING);

    // entering item moves to center
    this.enteringContent
      .to(TRANSLATEX, CENTER)
      .to(OPACITY, 1)
      .before.setStyles({ zIndex: this.enteringZ });

    this.enteringTitle
      .fadeIn()
      .to(TRANSLATEX, CENTER);

    this.enteringNavbarBg
      .to(TRANSLATEX, CENTER);

    // leaving view moves off screen
    this.leavingContent
      .from(TRANSLATEX, CENTER)
      .from(OPACITY, 1)
      .before.setStyles({ zIndex: this.leavingZ });

    this.leavingTitle
      .from(TRANSLATEX, CENTER)
      .from(OPACITY, 1);

    this.leavingNavbarBg
      .from(TRANSLATEX, CENTER);

    // set properties depending on direction
    if (opts.direction === 'back') {
      // back direction
      this.enteringContent
        .from(TRANSLATEX, OFF_LEFT)
        .from(OPACITY, OFF_OPACITY)
        .to(OPACITY, 1);

      this.enteringTitle
        .from(TRANSLATEX, OFF_LEFT);

      this.enteringNavbarBg
        .from(TRANSLATEX, OFF_LEFT);

      this.leavingContent
        .to(TRANSLATEX, '100%')
        .to(OPACITY, 1);

      this.leavingTitle
        .to(TRANSLATEX, '100%')
        .to(OPACITY, 0);

      this.leavingNavbarBg
        .to(TRANSLATEX, '100%');

      if (this.leaving && this.leaving.enableBack() && this.viewWidth() > 200) {
        let leavingBackButtonText = new Animation(this.leaving.backBtnTextRef());
        leavingBackButtonText.fromTo(TRANSLATEX, CENTER, (this.viewWidth() / 2) + 'px');
        this.leavingNavbar.add(leavingBackButtonText);
      }

    } else {
      // forward direction
      this.enteringContent
        .from(TRANSLATEX, '99.5%')
        .from(OPACITY, 1);

      this.enteringTitle
        .from(TRANSLATEX, '99.5%');

      this.enteringNavbarBg
        .from(TRANSLATEX, '99.5%');

      this.leavingContent
        .to(TRANSLATEX, OFF_LEFT)
        .to(OPACITY, OFF_OPACITY);

      this.leavingTitle
        .to(TRANSLATEX, OFF_LEFT)
        .to(OPACITY, 0);

      this.leavingNavbarBg
        .to(TRANSLATEX, OFF_LEFT);

      if (this.entering.enableBack() && this.viewWidth() > 200) {
        let enteringBackButtonText = new Animation(this.entering.backBtnTextRef());
        enteringBackButtonText.fromTo(TRANSLATEX, (this.viewWidth() / 2) + 'px', CENTER);
        this.enteringNavbar.add(enteringBackButtonText);
      }
    }

  }

}

Transition.register('ios', IOSTransition);
