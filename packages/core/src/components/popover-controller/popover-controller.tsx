import { Component, Listen, Method } from '@stencil/core';
import { PopoverEvent, PopoverOptions } from '../../index';

@Component({
  tag: 'ion-popover-controller'
})
export class PopoverController {
  private ids = 0;
  private popoverResolves: {[popoverId: string]: Function} = {};
  private popovers: HTMLIonPopoverElement[] = [];

  /**
   * Create a popover component instance
   * @param opts Options when creating a new popover instance
   */
  @Method()
  create(opts?: PopoverOptions): Promise<HTMLIonPopoverElement> {
    // create ionic's wrapping ion-popover component
    const popover = document.createElement('ion-popover');
    const id = this.ids++;

    // give this popover a unique id
    popover.popoverId = `popover-${id}`;

    // convert the passed in popover options into props
    // that get passed down into the new popover
    Object.assign(popover, opts);

    // append the popover element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(popover as any);

    // store the resolve function to be called later up when the popover loads
    return new Promise<HTMLIonPopoverElement>(resolve => {
      this.popoverResolves[popover.popoverId] = resolve;
    });
  }


  @Listen('body:ionPopoverDidLoad')
  protected didLoad(ev: PopoverEvent) {
    const popover = ev.target as HTMLIonPopoverElement;
    const popoverResolve = this.popoverResolves[popover.popoverId];
    if (popoverResolve) {
      popoverResolve(popover);
      delete this.popoverResolves[popover.popoverId];
    }
  }


  @Listen('body:ionPopoverWillPresent')
  protected willPresent(ev: PopoverEvent) {
    this.popovers.push(ev.target as HTMLIonPopoverElement);
  }


  @Listen('body:ionPopoverWillDismiss, body:ionPopoverDidUnload')
  protected willDismiss(ev: PopoverEvent) {
    const index = this.popovers.indexOf(ev.target as HTMLIonPopoverElement);
    if (index > -1) {
      this.popovers.splice(index, 1);
    }
  }


  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    const lastPopover = this.popovers[this.popovers.length - 1];
    if (lastPopover) {
      lastPopover.dismiss();
    }
  }

}
