import {App} from '../../../../../ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {


  buttonClick(button) {
    console.log(button);
  }
}
