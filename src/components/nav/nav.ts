import {Component, ElementRef, ViewContainerRef, DynamicComponentLoader, Input, Optional, NgZone, Renderer, Type, ViewChild, ViewEncapsulation, AfterViewInit} from '@angular/core';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {Keyboard} from '../../util/keyboard';
import {isTrueProperty} from '../../util/util';
import {NavController} from './nav-controller';
import {NavPortal} from './nav-portal';
import {ViewController} from './view-controller';

/**
 * @name Nav
 * @description
 * _For a quick walkthrough of navigation in Ionic, check out the
 * [Navigation section](../../../../components/#navigation) of the Component
 * docs._
 *
 * Nav is a basic navigation controller component.  As a subclass of NavController
 * you use it to navigate to pages in your app and manipulate the navigation stack.
 * Nav automatically animates transitions between pages for you.
 *
 * For more information on using navigation controllers like Nav or [Tab](../../Tabs/Tab/),
 * take a look at the [NavController API Docs](../NavController/).
 *
 * You must set a root page (where page is any [@Page](../../config/Page/)
 * component) to be loaded initially by any Nav you create, using
 * the 'root' property:
 *
 * @usage
 * ```ts
 * import {GettingStartedPage} from 'getting-started';
 * @App({
 *   template: `<ion-nav [root]="rootPage"></ion-nav>`
 * })
 * class MyApp {
 *   constructor(){
 *     this.rootPage = GettingStartedPage;
 *   }
 * }
 * ```
 *
 * ### Back Navigation
 *
 * If a [page](../NavController/#creating_pages) you navigate to has a [NavBar](../NavBar/),
 * Nav will automatically add a back button to it if there is a page
 * before the one you are navigating to in the navigation stack.
 *
 * Additionally, specifying the `swipeBackEnabled` property will allow you to
 * swipe to go back:
 * ```html
 * <ion-nav swipeBackEnabled="false" [root]="rootPage"></ion-nav>
 * ```
 *
 * Here is a diagram of how Nav animates smoothly between pages:
 *
 * <div class="highlight less-margin">
 *   <pre>
 *                           +-------+
 *                           |  App  |
 *                           +---+---+
 *                           &lt;ion-app&gt;
 *                               |
 *                  +------------+-------------+
 *                  |   Ionic Nav Controller   |
 *                  +------------+-------------+
 *                           &lt;ion-nav&gt;
 *                               |
 *                               |
 *             Page 3  +--------------------+                     LoginPage
 *           Page 2  +--------------------+ |
 *         Page 1  +--------------------+ | |              +--------------------+
 *                 | | Header           |&lt;-----------------|       Login        |
 *                 +--------------------+ | |              +--------------------+
 *                 | | |                | | |              | Username:          |
 *                 | | |                | | |              | Password:          |
 *                 | | |  Page 3 is     | | |              |                    |
 *                 | | |  only content  | | |              |                    |
 *                 | | |                |&lt;-----------------|                    |
 *                 | | |                | | |              |                    |
 *                 | | |                | | |              |                    |
 *                 | +------------------|-+ |              |                    |
 *                 | | Footer           |-|-+              |                    |
 *                 | +------------------|-+                |                    |
 *                 +--------------------+                  +--------------------+
 *
 *           +--------------------+    +--------------------+    +--------------------+
 *           | Header             |    | Content            |    | Content            |
 *           +--------------------+    |                    |    |                    |
 *           | Content            |    |                    |    |                    |
 *           |                    |    |                    |    |                    |
 *           |                    |    |                    |    |                    |
 *           |                    |    |                    |    |                    |
 *           |                    |    |                    |    |                    |
 *           |                    |    |                    |    |                    |
 *           |                    |    |                    |    |                    |
 *           |                    |    |                    |    |                    |
 *           |                    |    +--------------------+    |                    |
 *           |                    |    | Footer             |    |                    |
 *           +--------------------+    +--------------------+    +--------------------+
 *
 *   </pre>
 * </div>
 *
 * @demo /docs/v2/demos/navigation/
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 */
@Component({
  selector: 'ion-nav',
  template: '<div #viewport></div><div nav-portal></div>',
  directives: [NavPortal],
  encapsulation: ViewEncapsulation.None,
})
export class Nav extends NavController implements AfterViewInit {
  private _root: Type;
  private _hasInit: boolean = false;

  constructor(
    @Optional() viewCtrl: ViewController,
    @Optional() parent: NavController,
    app: IonicApp,
    config: Config,
    keyboard: Keyboard,
    elementRef: ElementRef,
    zone: NgZone,
    renderer: Renderer,
    loader: DynamicComponentLoader
  ) {
    super(parent, app, config, keyboard, elementRef, zone, renderer, loader);

    if (viewCtrl) {
      // an ion-nav can also act as an ion-page within a parent ion-nav
      // this would happen when an ion-nav nests a child ion-nav.
      viewCtrl.setContent(this);
      viewCtrl.setContentRef(elementRef);
    }

    if (parent) {
      // this Nav has a parent Nav
      parent.registerChildNav(this);

    } else if (app) {
      // this is the root navcontroller for the entire app
      this._app.setRootNav(this);
    }
  }

  /**
   * @private
   */
  @ViewChild('viewport', {read: ViewContainerRef})
  set _vp(val: ViewContainerRef) {
    this.setViewport(val);
  }

  /**
   * @private
   */
  ngAfterViewInit() {
    this._hasInit = true;

    if (this._root) {
      if (typeof this._root !== 'function') {
        throw 'The [root] property in <ion-nav> must be given a reference to a component class from within the constructor.';
      }
      this.push(this._root);
    }
  }

  /**
   * @input {Page} The Page component to load as the root page within this nav.
   */
  @Input()
  get root(): Type {
    return this._root;
  }
  set root(page: Type) {
    this._root = page;

    if (this._hasInit) {
      this.setRoot(page);
    }
  }

  /**
   * @input {boolean} Whether it's possible to swipe-to-go-back on this nav controller or not.
   */
  @Input()
  get swipeBackEnabled(): boolean {
    return this._sbEnabled;
  }

  set swipeBackEnabled(val: boolean) {
    this._sbEnabled = isTrueProperty(val);
  }

  @ViewChild(NavPortal)
  private set _np(val: NavPortal) {
    this.setPortal(val);
  }
}
