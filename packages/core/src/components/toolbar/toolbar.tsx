import { Component, Element, Prop } from '@stencil/core';
import { createThemedClasses } from '../../utils/theme';
import { Config } from '../../index';

/**
 * @name Toolbar
 * @description
 * A Toolbar is a generic bar that is positioned above or below content.
 * Unlike a [Navbar](../../navbar/Navbar), a toolbar can be used as a subheader.
 * When toolbars are placed within an `<ion-header>` or `<ion-footer>`,
 * the toolbars stay fixed in their respective location. When placed within
 * `<ion-content>`, toolbars will scroll with the content.
 *
 *
 * ### Buttons in a Toolbar
 * Buttons placed in a toolbar should be placed inside of the `<ion-buttons>`
 * element. An exception to this is a [menuToggle](../../menu/MenuToggle) button.
 * It should not be placed inside of the `<ion-buttons>` element. Both the
 * `<ion-buttons>` element and the `menuToggle` can be positioned inside of the
 * toolbar using different properties. The below chart has a description of each
 * property.
 *
 * | Property    | Description                                                                                                           |
 * |-------------|-----------------------------------------------------------------------------------------------------------------------|
 * | `start`     | Positions element to the left of the content in `ios` mode, and directly to the right in `md` mode.                   |
 * | `end`       | Positions element to the right of the content in `ios` mode, and to the far right in `md` mode.                       |
 * | `left`      | Positions element to the left of all other elements.                                                                  |
 * | `right`     | Positions element to the right of all other elements.                                                                 |
 *
 *
 * ### Header / Footer Box Shadow and Border
 * In `md` mode, the `<ion-header>` will receive a box-shadow on the bottom, and the
 * `<ion-footer>` will receive a box-shadow on the top.  In `ios` mode, the `<ion-header>`
 * will receive a border on the bottom, and the `<ion-footer>` will receive a border on the
 * top. Both the `md` box-shadow and the `ios` border can be removed by adding the `no-border`
 * attribute to the element.
 *
 * ```html
 * <ion-header no-border>
 *   <ion-toolbar>
 *     <ion-title>Header</ion-title>
 *   </ion-toolbar>
 * </ion-header>
 *
 * <ion-content>
 * </ion-content>
 *
 * <ion-footer no-border>
 *   <ion-toolbar>
 *     <ion-title>Footer</ion-title>
 *   </ion-toolbar>
 * </ion-footer>
 * ```
 *
 * @usage
 *
 * ```html
 *
 * <ion-header no-border>
 *
 *   <ion-toolbar>
 *     <ion-title>My Toolbar Title</ion-title>
 *   </ion-toolbar>
 *
 *   <ion-toolbar>
 *     <ion-title>I'm a subheader</ion-title>
 *   </ion-toolbar>
 *
 * <ion-header>
 *
 *
 * <ion-content>
 *
 *   <ion-toolbar>
 *     <ion-title>Scrolls with the content</ion-title>
 *   </ion-toolbar>
 *
 * </ion-content>
 *
 *
 * <ion-footer no-border>
 *
 *   <ion-toolbar>
 *     <ion-title>I'm a footer</ion-title>
 *   </ion-toolbar>
 *
 * </ion-footer>
 *  ```
 *
 * @demo /docs/demos/src/toolbar/
 * @see {@link ../../navbar/Navbar/ Navbar API Docs}
 */
@Component({
  tag: 'ion-toolbar',
  styleUrls: {
    ios: 'toolbar.ios.scss',
    md: 'toolbar.md.scss'
  },
  host: {
    theme: 'toolbar'
  }
})
export class Toolbar {
  @Element() private el: HTMLElement;

  @Prop({ context: 'config' }) config: Config;

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  protected ionViewDidLoad() {
    const buttons = this.el.querySelectorAll('ion-button') as any;
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('button-type', 'bar-button');
    }
  }

  hostData() {
    return {
      class: {
        'statusbar-padding': this.config.getBoolean('statusbarPadding')
      }
    };
  }

  protected render() {
    const backgroundCss = createThemedClasses(this.mode, this.color, 'toolbar-background');
    const contentCss = createThemedClasses(this.mode, this.color, 'toolbar-content');

    return [
      <div class={backgroundCss}></div>,
      <slot name='start'></slot>,
      <slot name='mode-start'></slot>,
      <slot name='mode-end'></slot>,
      <slot name='end'></slot>,
      <div class={contentCss}>
        <slot></slot>
      </div>
    ];
  }
}
