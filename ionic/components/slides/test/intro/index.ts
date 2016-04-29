import {App, Page, NavController} from '../../../../../ionic';


@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
class MyApp {
  rootPage;

  constructor() {
    this.rootPage = IntroPage;
  }
}

@Page({
  templateUrl: 'main.html'
})
class IntroPage {
  continueText: string = "Skip";
  startingIndex: number = 1;
  mySlideOptions;

  constructor(private nav: NavController) {
    this.mySlideOptions = {
      paginationClickable: true,
      lazyLoading: true,
      preloadImages: false,
      initialSlide: this.startingIndex
    };
  }

  onSlideChanged(slider) {
    console.log("Slide changed", slider);
  }

  onSlideChangeStart(slider) {
    console.log("Slide change start", slider);
    slider.isEnd ? this.continueText = "Continue" : this.continueText = "Skip";
  }

  onSlideMove(slider) {
    console.log("Slide move", slider);
  }

  skip() {
    this.nav.push(MainPage);
  }
}

@Page({
  template: `
  <ion-navbar *navbar>
    <ion-title>Slides</ion-title>
  </ion-navbar>

  <ion-content padding>
    <h1>Another Page</h1>
  </ion-content>

  `
})
class MainPage {

}
