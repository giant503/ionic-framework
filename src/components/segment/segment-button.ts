import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer, ViewEncapsulation } from '@angular/core';

import { isPresent, isTrueProperty } from '../../util/util';

/**
 * @name SegmentButton
 * @description
 * The child buttons of the `ion-segment` component. Each `ion-segment-button` must have a value.
 *
 * @usage
 *
 * ```html
 * <ion-content>
 *   <!-- Segment buttons with icons -->
 *   <ion-segment [(ngModel)]="icons" color="secondary">
 *     <ion-segment-button value="camera">
 *       <ion-icon name="camera"></ion-icon>
 *     </ion-segment-button>
 *     <ion-segment-button value="bookmark">
 *       <ion-icon name="bookmark"></ion-icon>
 *     </ion-segment-button>
 *   </ion-segment>
 *
 *   <!-- Segment buttons with text -->
 *   <ion-segment [(ngModel)]="relationship" color="primary">
 *     <ion-segment-button value="friends" (ionSelect)="selectedFriends()">
 *       Friends
 *     </ion-segment-button>
 *     <ion-segment-button value="enemies" (ionSelect)="selectedEnemies()">
 *       Enemies
 *     </ion-segment-button>
 *   </ion-segment>
 * </ion-content>
 * ```
 *
 *
 * @demo /docs/v2/demos/src/segment/
 * @see {@link /docs/v2/components#segment Segment Component Docs}
 * @see {@link /docs/v2/api/components/segment/Segment/ Segment API Docs}
 */
@Component({
  selector: 'ion-segment-button',
  template:
    '<ng-content></ng-content>' +
    '<div class="button-effect"></div>',
  host: {
    'tappable': '',
    'class': 'segment-button',
    'role': 'button'
  },
  encapsulation: ViewEncapsulation.None,
})
export class SegmentButton {
  _disabled: boolean = false;

  /**
   * @input {string} the value of the segment button. Required.
   */
  @Input() value: string;

  /**
   * @output {SegmentButton} Emitted when a segment button has been clicked.
   */
  @Output() ionSelect: EventEmitter<SegmentButton> = new EventEmitter<SegmentButton>();

  constructor(private _renderer: Renderer, private _elementRef: ElementRef) {}

  /**
   * @input {boolean} If true, the user cannot interact with this element.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(val: boolean) {
    this._disabled = isTrueProperty(val);
    this._setElementClass('segment-button-disabled', this._disabled);
  }

  /**
   * @private
   */
  _setElementClass(cssClass: string, shouldAdd: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, cssClass, shouldAdd);
  }

  /**
   * @private
   * On click of a SegmentButton
   */
  @HostListener('click')
  onClick() {
    console.debug('SegmentButton, select', this.value);
    this.ionSelect.emit(this);
  }

  /**
   * @private
   */
  ngOnInit() {
    if (!isPresent(this.value)) {
      console.warn('<ion-segment-button> requires a "value" attribute');
    }
  }

  /**
   * @private
   */
  set isActive(isActive: any) {
    this._renderer.setElementClass(this._elementRef.nativeElement, 'segment-activated', isActive);
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-pressed', isActive);
  }

}
