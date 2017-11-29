import { Component, CssClassMap, Element, Prop, State } from '@stencil/core';
import { createThemedClasses, getElementClassObject } from '../../utils/theme';


@Component({
  tag: 'ion-fab-button',
  styleUrls: {
    ios: 'fab.ios.scss',
    md: 'fab.md.scss'
  }
})
export class FabButton {
  @Element() private el: HTMLElement;

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

  /**
   * @input {string} Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

  /**
   * @input {boolean} If true, adds transparency to the fab.
   * Only affects `ios` mode. Defaults to `false`.
   */
  @Prop() translucent: boolean = false;

  @Prop() activated: boolean = false;
  @Prop() toggleActive: Function = () => {};

  @Prop() show: boolean = false;

  @State() private inContainer: boolean = false;
  @State() private inList: boolean = false;

  /**
   * @input {boolean} If true, sets the button into a disabled state.
   */
  @Prop() disabled: boolean = false;

  componentDidLoad() {
    const parentNode = this.el.parentNode.nodeName;

    this.inList = (parentNode === 'ION-FAB-LIST');
    this.inContainer = (parentNode === 'ION-FAB');
  }


  clickedFab() {
    if (this.inContainer) {
      this.toggleActive();
    }
  }

  /**
   * @hidden
   * Get the classes for fab buttons in lists
   */
  getFabListClassList() {
    if (!this.inList) {
      return [];
    }
    let listClasses = [
      `fab-in-list`,
      `fab-${this.mode}-in-list`
    ];

    if (this.translucent) {
      listClasses.push(`fab-translucent-${this.mode}-in-list`);
    }

    return listClasses;
  }

  /**
   * @hidden
   * Get the close active class for fab buttons
   */
  getFabActiveClassList() {
    if (!this.activated) {
      return [];
    }
    return [
      `fab-close-active`
    ];
  }

  /**
   * @hidden
   * Get the show class for fab buttons
   */
  getFabShowClassList() {
    if (!this.show) {
      return [];
    }
    return [
      `show`
    ];
  }

  render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'fab');
    const translucentClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'fab-translucent') : {};
    const hostClasses = getElementClassObject(this.el.classList);

    const elementClasses: CssClassMap = []
      .concat(
        this.getFabListClassList(),
        this.getFabActiveClassList(),
        this.getFabShowClassList()
      )
      .reduce((prevValue, cssClass) => {
        prevValue[cssClass] = true;
        return prevValue;
      }, {});

    const TagType = this.href ? 'a' : 'button';

    const fabClasses = {
      ...themedClasses,
      ...translucentClasses,
      ...hostClasses,
      ...elementClasses
    };

    return (
      <TagType class={fabClasses} onClick={this.clickedFab.bind(this)} disabled={this.disabled}>
        <ion-icon name='close' class='fab-close-icon'></ion-icon>
        <span class='button-inner'>
          <slot></slot>
        </span>
        <div class='button-effect'></div>
      </TagType>
    );
  }
}
