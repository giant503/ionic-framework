import { Component, Prop } from '@stencil/core';

import { createThemedClasses } from '../../utils/theme';

@Component({
  tag: 'ion-footer',
  host: {
    theme: 'footer'
  }
})
export class Footer {
  mode: string;
  color: string;

  /**
   * @input {boolean} If true, adds transparency to the footer.
   * Note: In order to scroll content behind the footer, the `fullscreen`
   * attribute needs to be set on the content.
   * Only affects `ios` mode. Defaults to `false`.
   */
  @Prop() translucent: boolean = false;

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'header-translucent') : {};

    const hostClasses = {
      ...themedClasses
    };

    return {
      class: hostClasses
    };
  }

  render() {
    return <slot></slot>;
  }
}
