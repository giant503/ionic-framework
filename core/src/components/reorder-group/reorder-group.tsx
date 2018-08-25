import { Component, Element, Prop, QueueApi, State, Watch } from '@stencil/core';

import { Gesture, GestureDetail } from '../../interface';
import { hapticSelectionChanged, hapticSelectionEnd, hapticSelectionStart } from '../../utils/haptic';

@Component({
  tag: 'ion-reorder-group',
  styleUrl: 'reorder-group.scss'
})
export class ReorderGroup {

  private selectedItemEl?: HTMLElement;
  private selectedItemHeight!: number;
  private lastToIndex!: number;
  private cachedHeights: number[] = [];
  private scrollEl?: HTMLElement;
  private gesture?: Gesture;

  private scrollElTop = 0;
  private scrollElBottom = 0;
  private scrollElInitial = 0;

  private containerTop = 0;
  private containerBottom = 0;

  @State() activated = false;

  @Element() el!: HTMLElement;

  @Prop({ context: 'queue' }) queue!: QueueApi;
  @Prop({ context: 'document' }) doc!: Document;

  /**
   * If true, the reorder will be hidden. Defaults to `true`.
   */
  @Prop() disabled = true;
  @Watch('disabled')
  disabledChanged() {
    if (this.gesture) {
      this.gesture.setDisabled(this.disabled);
    }
  }

  async componentDidLoad() {
    const contentEl = this.el.closest('ion-content');
    if (contentEl) {
      await contentEl.componentOnReady();
      this.scrollEl = contentEl.getScrollElement();
    }

    this.gesture = (await import('../../utils/gesture/gesture')).createGesture({
      el: this.doc.body,
      queue: this.queue,
      gestureName: 'reorder',
      gesturePriority: 90,
      disableScroll: true,
      threshold: 0,
      direction: 'y',
      passive: false,
      canStart: this.canStart.bind(this),
      onStart: this.onStart.bind(this),
      onMove: this.onMove.bind(this),
      onEnd: this.onEnd.bind(this),
    });
    this.disabledChanged();
  }

  componentDidUnload() {
    this.onEnd();
  }

  private canStart(ev: GestureDetail): boolean {
    if (this.selectedItemEl) {
      return false;
    }
    const target = ev.event.target as HTMLElement;
    const reorderEl = target.closest('ion-reorder');
    if (!reorderEl) {
      return false;
    }
    const item = findReorderItem(reorderEl, this.el);
    if (!item) {
      console.error('reorder node not found');
      return false;
    }
    ev.data = item;
    return true;
  }

  private onStart(ev: GestureDetail) {
    ev.event.preventDefault();

    const item = this.selectedItemEl = ev.data;
    const heights = this.cachedHeights;
    heights.length = 0;
    const el = this.el;
    const children: any = el.children;
    if (!children || children.length === 0) {
      return;
    }

    let sum = 0;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      sum += child.offsetHeight;
      heights.push(sum);
      child.$ionIndex = i;
    }

    const box = this.el.getBoundingClientRect();
    this.containerTop = box.top;
    this.containerBottom = box.bottom;

    if (this.scrollEl) {
      const scrollBox = this.scrollEl.getBoundingClientRect();
      this.scrollElInitial = this.scrollEl.scrollTop;
      this.scrollElTop = scrollBox.top + AUTO_SCROLL_MARGIN;
      this.scrollElBottom = scrollBox.bottom - AUTO_SCROLL_MARGIN;
    } else {
      this.scrollElInitial = 0;
      this.scrollElTop = 0;
      this.scrollElBottom = 0;
    }

    this.lastToIndex = indexForItem(item);
    this.selectedItemHeight = item.offsetHeight;
    this.activated = true;

    item.classList.add(ITEM_REORDER_SELECTED);

    hapticSelectionStart();
  }

  private onMove(ev: GestureDetail) {
    const selectedItem = this.selectedItemEl;
    if (!selectedItem) {
      return;
    }
    // Scroll if we reach the scroll margins
    const scroll = this.autoscroll(ev.currentY);

    // // Get coordinate
    const top = this.containerTop - scroll;
    const bottom = this.containerBottom - scroll;
    const currentY = Math.max(top, Math.min(ev.currentY, bottom));
    const deltaY = scroll + currentY - ev.startY;
    const normalizedY = currentY - top;
    const toIndex = this.itemIndexForTop(normalizedY);
    if (toIndex !== undefined && (toIndex !== this.lastToIndex)) {
      const fromIndex = indexForItem(selectedItem);
      this.lastToIndex = toIndex;

      hapticSelectionChanged();
      this.reorderMove(fromIndex, toIndex);
    }

    // Update selected item position
    selectedItem.style.transform = `translateY(${deltaY}px)`;
  }

  private onEnd() {
    this.activated = false;
    const selectedItem = this.selectedItemEl;
    if (!selectedItem) {
      return;
    }

    const children = this.el.children as any;
    const toIndex = this.lastToIndex;
    const fromIndex = indexForItem(selectedItem);

    const ref = (fromIndex < toIndex)
      ? children[toIndex + 1]
      : children[toIndex];

    this.el.insertBefore(selectedItem, ref);

    const len = children.length;
    for (let i = 0; i < len; i++) {
      children[i].style['transform'] = '';
    }

    const reorderInactive = () => {
      if (this.selectedItemEl) {
        this.selectedItemEl.style.transition = '';
        this.selectedItemEl.classList.remove(ITEM_REORDER_SELECTED);
        this.selectedItemEl = undefined;
      }
    };
    if (toIndex === fromIndex) {
      selectedItem.style.transition = 'transform 200ms ease-in-out';
      setTimeout(reorderInactive, 200);
    } else {
      reorderInactive();
    }

    hapticSelectionEnd();
  }

  private itemIndexForTop(deltaY: number): number {
    const heights = this.cachedHeights;
    let i = 0;

    // TODO: since heights is a sorted array of integers, we can do
    // speed up the search using binary search. Remember that linear-search is still
    // faster than binary-search for small arrays (<64) due CPU branch misprediction.
    for (i = 0; i < heights.length; i++) {
      if (heights[i] > deltaY) {
        break;
      }
    }
    return i;
  }

  /********* DOM WRITE ********* */
  private reorderMove(fromIndex: number, toIndex: number) {
    const itemHeight = this.selectedItemHeight;
    const children = this.el.children;
    for (let i = 0; i < children.length; i++) {
      const style = (children[i] as any).style;
      let value = '';
      if (i > fromIndex && i <= toIndex) {
        value = `translateY(${-itemHeight}px)`;
      } else if (i < fromIndex && i >= toIndex) {
        value = `translateY(${itemHeight}px)`;
      }
      style['transform'] = value;
    }
  }

  private autoscroll(posY: number): number {
    if (!this.scrollEl) {
      return 0;
    }

    let amount = 0;
    if (posY < this.scrollElTop) {
      amount = -SCROLL_JUMP;
    } else if (posY > this.scrollElBottom) {
      amount = SCROLL_JUMP;
    }
    if (amount !== 0) {
      this.scrollEl.scrollBy(0, amount);
    }
    return this.scrollEl.scrollTop - this.scrollElInitial;
  }

  hostData() {
    return {
      class: {
        'reorder-enabled': !this.disabled,
        'reorder-list-active': this.activated,
      }
    };
  }
}

function indexForItem(element: any): number {
  return element['$ionIndex'];
}

function findReorderItem(node: HTMLElement, container: HTMLElement): HTMLElement | null {
  let nested = 0;
  let parent;
  while (node && nested < 6) {
    parent = node.parentNode as HTMLElement;
    if (parent === container) {
      return node;
    }
    node = parent;
    nested++;
  }
  return null;
}

const AUTO_SCROLL_MARGIN = 60;
const SCROLL_JUMP = 10;
const ITEM_REORDER_SELECTED = 'reorder-selected';
