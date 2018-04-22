import { BlurEvent, CheckedInputChangeEvent, FocusEvent, RadioButtonInput, StyleEvent } from '../../utils/input-interfaces';
import { Component, ComponentDidLoad, ComponentDidUnload, ComponentWillLoad, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';
import { createThemedClasses } from '../../utils/theme';
import { CssClassMap, Mode } from '../../index';
import { deferEvent } from '../../utils/helpers';


@Component({
  tag: 'ion-radio',
  styleUrls: {
    ios: 'radio.ios.scss',
    md: 'radio.md.scss'
  },
  host: {
    theme: 'radio'
  }
})
export class Radio implements RadioButtonInput, ComponentDidLoad, ComponentDidUnload, ComponentWillLoad {

  private inputId = `ion-rb-${radioButtonIds++}`;
  private nativeInput!: HTMLInputElement;

  @State() keyFocus = false;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color!: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode!: Mode;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /*
   * If true, the user cannot interact with the radio. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * If true, the radio is selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * the value of the radio.
   */
  @Prop({ mutable: true }) value!: string;

  /**
   * Emitted when the radio loads.
   */
  @Event() ionRadioDidLoad!: EventEmitter;

  /**
   * Emitted when the radio unloads.
   */
  @Event() ionRadioDidUnload!: EventEmitter;

  /**
   * Emitted when the styles change.
   */
  @Event() ionStyle!: EventEmitter<StyleEvent>;

  /**
   * Emitted when the radio button is selected.
   */
  @Event() ionSelect!: EventEmitter<CheckedInputChangeEvent>;

  /**
   * Emitted when the radio button has focus.
   */
  @Event() ionFocus!: EventEmitter<FocusEvent>;

  /**
   * Emitted when the radio button loses focus.
   */
  @Event() ionBlur!: EventEmitter<BlurEvent>;


  componentWillLoad() {
    this.ionSelect = deferEvent(this.ionSelect);
    this.ionStyle = deferEvent(this.ionStyle);

    if (this.value === undefined) {
      this.value = this.inputId;
    }
    this.emitStyle();
  }

  componentDidLoad() {
    this.ionRadioDidLoad.emit({ radio: this });
    this.nativeInput.checked = this.checked;

    const parentItem = this.nativeInput.closest('ion-item');
    if (parentItem) {
      const itemLabel = parentItem.querySelector('ion-label');
      if (itemLabel) {
        itemLabel.id = this.inputId + '-lbl';
        this.nativeInput.setAttribute('aria-labelledby', itemLabel.id);
      }
    }
  }

  componentDidUnload() {
    this.ionRadioDidUnload.emit({ radio: this });
  }

  @Watch('color')
  colorChanged() {
    this.emitStyle();
  }

  @Watch('checked')
  checkedChanged(isChecked: boolean) {
    if (this.nativeInput.checked !== isChecked) {
      // keep the checked value and native input `nync
      this.nativeInput.checked = isChecked;
    }

    if (isChecked) {
      this.ionSelect.emit({
        checked: true,
        value: this.value
      });
    }
    this.emitStyle();
  }

  @Watch('disabled')
  disabledChanged(isDisabled: boolean) {
    this.nativeInput.disabled = isDisabled;
    this.emitStyle();
  }

  emitStyle() {
    this.ionStyle.emit({
      ...createThemedClasses(this.mode, this.color, 'radio'),
      'radio-checked': this.checked,
      'radio-disabled': this.disabled
    });
  }

  onClick() {
    this.checkedChanged(true);
  }

  onChange() {
    this.checked = true;
    this.nativeInput.focus();
  }

  onKeyUp() {
    this.keyFocus = true;
  }

  onFocus() {
    this.ionFocus.emit();
  }

  onBlur() {
    this.keyFocus = false;
    this.ionBlur.emit();
  }

  hostData() {
    return {
      'class': {
        'radio-checked': this.checked,
        'radio-disabled': this.disabled,
        'radio-key': this.keyFocus
      }
    };
  }

  render() {
    const radioClasses: CssClassMap = {
      'radio-icon': true,
      'radio-checked': this.checked
    };
    return [
      <div class={radioClasses}>
        <div class="radio-inner"/>
      </div>,
      <input
        type="radio"
        onClick={this.onClick.bind(this)}
        onChange={this.onChange.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)}
        id={this.inputId}
        name={this.name}
        value={this.value}
        disabled={this.disabled}
        ref={r => this.nativeInput = (r as any)}/>
    ];
  }
}


export interface HTMLIonRadioElementEvent extends CustomEvent {
  target: HTMLIonRadioElement;
}

let radioButtonIds = 0;
