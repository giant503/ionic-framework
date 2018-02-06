import { Component, Element, Listen } from '@stencil/core';

@Component({
  tag: 'ion-nav-pop',
  styleUrls: {
    ios: 'nav-pop.ios.scss',
    md: 'nav-pop.md.scss'
  },
  host: {
    theme: 'nav-pop'
  }
})
export class NavPop {

  @Element() element: HTMLElement;

  @Listen('child:click')
  pop() {
    const nav = this.element.closest('ion-nav') as HTMLIonNavElement;
    if (nav) {
      return nav.pop();
    }
    return Promise.resolve();
  }

  render() {
    return <slot></slot>;
  }

}
