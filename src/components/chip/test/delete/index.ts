import {App, IonicApp} from '../../../../../ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor(app: IonicApp) {
  }

  deleteClicked() {
    console.log('deleteClicked');
  }
}
