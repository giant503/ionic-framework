import { Component, CssClassMap, Element, Prop } from '@stencil/core';
import { getButtonClassMap, getElementClassMap } from '../../utils/theme';

@Component({
  tag: 'ion-chip-button',
  styleUrls: {
    ios: 'chip-button.ios.scss',
    md: 'chip-button.md.scss'
  },
})
export class ChipButton {
  @Element() private el: HTMLElement;

  /**
   * The color to use.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * If true, the user cannot interact with the chip button. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * Set to `"clear"` for a transparent button style.
   */
  @Prop() fill: string;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

  /**
   * Get the classes for the style
   * Chip buttons can only be clear or default (solid)
   */
  private getStyleClassMap(buttonType: string): CssClassMap {
    return getColorClassMap(this.color, buttonType, this.fill || 'default', this.mode);
  }

  render() {
    const buttonType = 'chip-button';

    const hostClasses = getElementClassMap(this.el.classList);
    const TagType = this.href ? 'a' : 'button';

    const buttonClasses = {
      ...hostClasses,
      ...getButtonClassMap(buttonType, this.mode),
      ...this.getStyleClassMap(buttonType),
    };

    return (
      <TagType
        class={buttonClasses}
        disabled={this.disabled}
        href={this.href}>
          <span class='chip-button-inner'>
            <slot></slot>
          </span>
          { this.mode === 'md' && <ion-ripple-effect/> }
      </TagType>
    );
  }
}

/**
 * Get the classes for the color
 */
function getColorClassMap(color: string, buttonType: string, style: string, mode: string): CssClassMap {
  const className = (style === 'default') ? `${buttonType}` : `${buttonType}-${style}`;

  const map: CssClassMap = {
    [className]: true,
    [`${className}-${mode}`]: true
  };
  if (color) {
    map[`${className}-${mode}-${color}`] = true;
  }
  return map;
}
