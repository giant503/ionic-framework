import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Method, Prop, State, Watch } from '@stencil/core';

import { ActionSheetButton, ActionSheetOptions, AlertOptions, CssClassMap, Mode, OverlaySelect, PopoverOptions, SelectInputChangeEvent, SelectInterface, SelectPopoverOption, StyleEvent } from '../../interface';
import { deferEvent, renderHiddenInput } from '../../utils/helpers';
import { hostContext } from '../../utils/theme';

@Component({
  tag: 'ion-select',
  styleUrls: {
    ios: 'select.ios.scss',
    md: 'select.md.scss'
  },
  shadow: true
})
export class Select implements ComponentInterface {

  private childOpts: HTMLIonSelectOptionElement[] = [];
  private inputId = `ion-sel-${selectIds++}`;
  private labelId?: string;
  private overlay?: OverlaySelect;

  @Element() el!: HTMLIonSelectElement;

  @Prop({ connect: 'ion-action-sheet-controller' }) actionSheetCtrl!: HTMLIonActionSheetControllerElement;
  @Prop({ connect: 'ion-alert-controller' }) alertCtrl!: HTMLIonAlertControllerElement;
  @Prop({ connect: 'ion-popover-controller' }) popoverCtrl!: HTMLIonPopoverControllerElement;

  @State() isExpanded = false;
  @State() keyFocus = false;
  @State() text = '';

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * If `true`, the user cannot interact with the select. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * The text to display on the cancel button. Default: `Cancel`.
   */
  @Prop() cancelText = 'Cancel';

  /**
   * The text to display on the ok button. Default: `OK`.
   */
  @Prop() okText = 'OK';

  /**
   * The text to display when the select is empty.
   */
  @Prop() placeholder?: string | null;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * The text to display instead of the selected option's value.
   */
  @Prop() selectedText?: string | null;

  /**
   * If `true`, the select can accept multiple values.
   */
  @Prop() multiple = false;

  /**
   * The interface the select should use: `action-sheet`, `popover` or `alert`. Default: `alert`.
   */
  @Prop() interface: SelectInterface = 'alert';

  /**
   * Any additional options that the `alert`, `action-sheet` or `popover` interface
   * can take. See the [AlertController API docs](../../alert/AlertController/#create), the
   * [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) and the
   * [PopoverController API docs](../../popover/PopoverController/#create) for the
   * create options for each interface.
   */
  @Prop() interfaceOptions: any = {};

  /**
   * the value of the select.
   */
  @Prop({ mutable: true }) value?: any | null;

  /**
   * Emitted when the value has changed.
   */
  @Event() ionChange!: EventEmitter<SelectInputChangeEvent>;

  /**
   * Emitted when the selection is cancelled.
   */
  @Event() ionCancel!: EventEmitter<void>;

  /**
   * Emitted when the select has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the select loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  /**
   * Emitted when the styles change.
   */
  @Event() ionStyle!: EventEmitter<StyleEvent>;

  @Watch('disabled')
  disabledChanged() {
    this.emitStyle();
  }

  @Watch('value')
  valueChanged() {
    // this select value just changed
    // double check the select option with this value is checked
    if (this.value === undefined) {
      // set to undefined
      // ensure all that are checked become unchecked
      this.childOpts.filter(o => o.selected).forEach(selectOption => {
        selectOption.selected = false;
      });
      this.text = '';

    } else {
      let hasChecked = false;
      const texts: string[] = [];

      this.childOpts.forEach(selectOption => {
        if ((Array.isArray(this.value) && this.value.includes(selectOption.value)) || (selectOption.value === this.value)) {
          if (!selectOption.selected && (this.multiple || !hasChecked)) {
            // correct value for this select option
            // but this select option isn't checked yet
            // and we haven't found a checked yet
            // so CHECK IT!
            selectOption.selected = true;

          } else if (!this.multiple && hasChecked && selectOption.selected) {
            // somehow we've got multiple select options
            // with the same value, but only one can be checked
            selectOption.selected = false;
          }

          // remember we've got a checked select option button now
          hasChecked = true;

        } else if (selectOption.selected) {
          // this select option doesn't have the correct value
          // and it's also checked, so let's uncheck it
          selectOption.selected = false;
        }

        if (selectOption.selected) {
          texts.push(selectOption.textContent || '');
        }
      });

      this.text = texts.join(', ');
    }

    // emit the new value
    this.ionChange.emit({
      value: this.value,
      text: this.text
    });
    this.emitStyle();
  }

  @Listen('ionSelectOptionDidLoad')
  optLoad(ev: CustomEvent) {
    const selectOption = ev.target as HTMLIonSelectOptionElement;
    this.childOpts = Array.from(this.el.querySelectorAll('ion-select-option'));

    if (this.value != null && (Array.isArray(this.value) && this.value.includes(selectOption.value)) || (selectOption.value === this.value)) {
      // this select has a value and this
      // option equals the correct select value
      // so let's check this select option
      selectOption.selected = true;

    } else if (Array.isArray(this.value) && this.multiple && selectOption.selected) {
      // if the value is an array we need to push the option on
      this.value.push(selectOption.value);

    } else if (this.value === undefined && selectOption.selected) {
      // this select does not have a value
      // but this select option is checked, so let's set the
      // select's value from the checked select option
      this.value = selectOption.value;

    } else if (selectOption.selected) {
      // if it doesn't match one of the above cases, but the
      // select option is still checked, then we need to uncheck it
      selectOption.selected = false;
    }
  }

  @Listen('ionSelectOptionDidUnload')
  optUnload(ev: CustomEvent) {
    const index = this.childOpts.indexOf(ev.target as HTMLIonSelectOptionElement);
    if (index > -1) {
      this.childOpts.splice(index, 1);
    }
  }

  @Listen('ionSelect')
  onSelect(ev: CustomEvent) {
    // ionSelect only come from the checked select option
    this.childOpts.forEach(selectOption => {
      if (selectOption === ev.target) {
        this.value = selectOption.value;
      } else {
        selectOption.selected = false;
      }
    });
  }

  componentWillLoad() {
    if (!this.value) {
      this.value = this.multiple ? [] : undefined;
    }
  }

  componentDidLoad() {
    this.ionStyle = deferEvent(this.ionStyle);

    const label = this.getLabel();
    if (label) {
      this.labelId = label.id = this.name + '-lbl';
    }

    if (this.multiple) {
      // there are no values set at this point
      // so check to see who should be selected
      const checked = this.childOpts.filter(o => o.selected);

      (this.value as string[]).length = 0;
      checked.forEach(o => {
        // doing this instead of map() so we don't
        // fire off an unnecessary change event
        (this.value as string[]).push(o.value);
      });
      this.text = checked.map(o => o.textContent).join(', ');

    } else {
      const checked = this.childOpts.find(o => o.selected);
      if (checked) {
        this.value = checked.value;
        this.text = checked.textContent || '';
      }
    }
    this.emitStyle();
  }

  /**
   * Opens the select overlay, it could be an alert, action-sheet or popover,
   * based in `ion-select` settings.
   */
  @Method()
  open(ev?: UIEvent): Promise<OverlaySelect> {
    let selectInterface = this.interface;

    if ((selectInterface === 'action-sheet' || selectInterface === 'popover') && this.multiple) {
      console.warn(`Select interface cannot be "${selectInterface}" with a multi-value select. Using the "alert" interface instead.`);
      selectInterface = 'alert';
    }

    if (selectInterface === 'popover' && !ev) {
      console.warn('Select interface cannot be a "popover" without passing an event. Using the "alert" interface instead.');
      selectInterface = 'alert';
    }

    if (selectInterface === 'popover') {
      return this.openPopover(ev!);
    }

    if (selectInterface === 'action-sheet') {
      return this.openActionSheet();
    }

    return this.openAlert();
  }

  private getLabel() {
    const item = this.el.closest('ion-item');
    if (item) {
      return item.querySelector('ion-label');
    }
    return null;
  }

  private async openPopover(ev: UIEvent) {
    const interfaceOptions = this.interfaceOptions;

    const popoverOpts: PopoverOptions = {
      ...interfaceOptions,

      component: 'ion-select-popover',
      cssClass: ['select-popover', interfaceOptions.cssClass],
      event: ev,
      componentProps: {
        header: interfaceOptions.header,
        subHeader: interfaceOptions.subHeader,
        message: interfaceOptions.message,
        value: this.value,
        options: this.childOpts.map(o => {
          return {
            text: o.textContent,
            value: o.value,
            checked: o.selected,
            disabled: o.disabled,
            handler: () => {
              this.value = o.value;
              this.close();
            }
          } as SelectPopoverOption;
        })
      }
    };

    const popover = this.overlay = await this.popoverCtrl.create(popoverOpts);
    await popover.present();
    this.isExpanded = true;
    return popover;
  }

  private async openActionSheet() {
    const actionSheetButtons = this.childOpts.map(option => {
      return {
        role: (option.selected ? 'selected' : ''),
        text: option.textContent,
        handler: () => {
          this.value = option.value;
        }
      } as ActionSheetButton;
    });

    actionSheetButtons.push({
      text: this.cancelText,
      role: 'cancel',
      handler: () => {
        this.ionCancel.emit();
      }
    });

    const interfaceOptions = this.interfaceOptions;
    const actionSheetOpts: ActionSheetOptions = {
      ...interfaceOptions,

      buttons: actionSheetButtons,
      cssClass: ['select-action-sheet', interfaceOptions.cssClass]
    };

    const actionSheet = this.overlay = await this.actionSheetCtrl.create(actionSheetOpts);
    await actionSheet.present();

    this.isExpanded = true;
    return actionSheet;
  }

  private async openAlert() {

    const label = this.getLabel();
    const labelText = (label) ? label.textContent : null;

    const interfaceOptions = this.interfaceOptions;
    const inputType = (this.multiple ? 'checkbox' : 'radio');

    const alertOpts: AlertOptions = {
      ...interfaceOptions,

      header: interfaceOptions.header ? interfaceOptions.header : labelText,
      inputs: this.childOpts.map(o => {
        return {
          type: inputType,
          label: o.textContent,
          value: o.value,
          checked: o.selected,
          disabled: o.disabled
        };
      }),
      buttons: [
        {
          text: this.cancelText,
          role: 'cancel',
          handler: () => {
            this.ionCancel.emit();
          }
        },
        {
          text: this.okText,
          handler: (selectedValues: any) => {
            this.value = selectedValues;
          }
        }
      ],
      cssClass: ['select-alert', interfaceOptions.cssClass,
                 (this.multiple ? 'multiple-select-alert' : 'single-select-alert')]
    };

    const alert = this.overlay = await this.alertCtrl.create(alertOpts);
    await alert.present();

    this.isExpanded = true;
    return alert;
  }

  /**
   * Close the select interface.
   */
  private close(): Promise<boolean> {
    // TODO check !this.overlay || !this.isFocus()
    if (!this.overlay) {
      return Promise.resolve(false);
    }

    const overlay = this.overlay;
    this.overlay = undefined;
    this.isExpanded = false;

    return overlay.dismiss();
  }

  private onKeyUp = () => {
    this.keyFocus = true;
  }

  private onFocus = () => {
    this.ionFocus.emit();
  }

  private onBlur = () => {
    this.keyFocus = false;
    this.ionBlur.emit();
  }

  hasValue(): boolean {
    if (Array.isArray(this.value)) {
      return this.value.length > 0;
    }
    return (this.value != null && this.value !== undefined && this.value !== '');
  }

  private emitStyle() {
    this.ionStyle.emit({
      'interactive': true,
      'select': true,
      'has-value': this.hasValue(),
      'interactive-disabled': this.disabled,
      'select-disabled': this.disabled
    });
  }

  hostData() {
    return {
      class: {
        'in-item': hostContext('ion-item', this.el),
        'select-disabled': this.disabled,
        'select-key': this.keyFocus
      }
    };
  }

  render() {
    renderHiddenInput(this.el, this.name, parseValue(this.value), this.disabled);

    let addPlaceholderClass = false;

    let selectText = this.selectedText || this.text;
    if (selectText === '' && this.placeholder != null) {
      selectText = this.placeholder;
      addPlaceholderClass = true;
    }

    const selectTextClasses: CssClassMap = {
      'select-text': true,
      'select-placeholder': addPlaceholderClass
    };

    return [
      <div
        role="textbox"
        aria-multiline="false"
        class={selectTextClasses}
      >
        {selectText}
      </div>,
      <div class="select-icon" role="presentation">
        <div class="select-icon-inner"></div>
      </div>,
      <button
        type="button"
        role="combobox"
        aria-haspopup="dialog"
        aria-labelledby={this.labelId}
        aria-expanded={this.isExpanded ? 'true' : null}
        aria-disabled={this.disabled ? 'true' : null}
        onClick={this.open.bind(this)}
        onKeyUp={this.onKeyUp}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        class="select-cover"
      >
        <slot></slot>
        {this.mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </button>
    ];
  }
}

function parseValue(value: any) {
  if (value == null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.join(',');
  }
  return value.toString();
}

let selectIds = 0;
