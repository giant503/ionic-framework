import { Component, Element, Listen } from '@stencil/core';

@Component({
  tag: 'ion-nav-pop',
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
