import {App} from '../../../../../ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  paused: boolean = false;

  toggleState() {
    this.paused = !this.paused;
  }
}
