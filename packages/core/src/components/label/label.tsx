import { Component, Element, Event, EventEmitter, Method, Prop } from '@stencil/core';


@Component({
  tag: 'ion-label',
  styleUrls: {
    ios: 'label.ios.scss',
    md: 'label.md.scss'
  },
  host: {
    theme: 'label'
  }
})
export class Label {
  styleTmr: any;

  @Element() private el: HTMLElement;

  /**
   * @output {Event} Emitted when the styles change.
   */
  @Event() ionStyle: EventEmitter;

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
   * @output {Event} If true, the label will sit alongside an input. Defaults to `false`.
   */
  @Prop() fixed: boolean = false;

  /**
   * @output {Event} If true, the label will float above an input when the value is empty or the input is focused. Defaults to `false`.
   */
  @Prop() floating: boolean = false;

  /**
   * @output {Event} If true, the label will be stacked above an input. Defaults to `false`.
   */
  @Prop() stacked: boolean = false;

  /**
   * @hidden
   */
  @Method()
  getText(): string {
    return this.el.textContent || '';
  }

  protected ionViewDidLoad() {
    this.emitStyle();
  }

  emitStyle() {
    clearTimeout(this.styleTmr);

    let styles = {
      'label-fixed': this.fixed,
      'label-floating': this.floating,
      'label-stacked': this.stacked
    };

    this.styleTmr = setTimeout(() => {
      this.ionStyle.emit(styles);
    });
  }

  protected render() {
    return <slot></slot>;
  }
}
