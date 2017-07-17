import { Component, h, Ionic, VNodeData } from '@stencil/core';
import { getParentElement, getToolbarHeight } from '../../utils/helpers';


@Component({
  tag: 'ion-fixed',
  styleUrl: 'fixed.scss'
})
export class Fixed {
  $el: HTMLElement;
  mode: string;

  hostData(): VNodeData {
    const pageChildren: HTMLElement[] = getParentElement(this.$el).children;
    const headerHeight = getToolbarHeight('ION-HEADER', pageChildren, this.mode, '44px', '56px');
    const footerHeight = getToolbarHeight('ION-FOOTER', pageChildren, this.mode, '50px', '48px');

    return {
      class: {
        'statusbar-padding': Ionic.config.getBoolean('statusbarPadding')
      },
      style: {
        'margin-top': headerHeight,
        'margin-bottom': footerHeight
      }
    };
  }

  render() {
    return (
      <slot></slot>
    );
  }
}
