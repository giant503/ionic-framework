# ion-input

The input component is a wrapper to the HTML input element with custom styling and additional functionality. It accepts most of the same properties as the HTML input, but works great on desktop devices and integrates with the keyboard on mobile devices.

It is meant for text `type` inputs only, such as `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, and `"url"`. It supports all standard text input events including keyup, keydown, keypress, and more.


<!-- Auto Generated Below -->


## Properties

| Property         | Attribute        | Description                                                                                                                                                                                                                                                                                                                                          | Type                                                                                  |
| ---------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `accept`         | `accept`         | If the value of the type attribute is `"file"`, then this attribute will indicate the types of files that the server accepts, otherwise it will be ignored. The value must be a comma-separated list of unique content type specifiers.                                                                                                              | `string \| undefined`                                                                 |
| `autocapitalize` | `autocapitalize` | Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Defaults to `"none"`.                                                                                                                                                                                                              | `string`                                                                              |
| `autocomplete`   | `autocomplete`   | Indicates whether the value of the control can be automatically completed by the browser. Defaults to `"off"`.                                                                                                                                                                                                                                       | `string`                                                                              |
| `autocorrect`    | `autocorrect`    | Whether autocorrection should be enabled when the user is entering/editing the text value. Defaults to `"off"`.                                                                                                                                                                                                                                      | `string`                                                                              |
| `autofocus`      | `autofocus`      | This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.                                                                                                                                                                                                                        | `boolean`                                                                             |
| `clearInput`     | `clear-input`    | If `true`, a clear icon will appear in the input when there is a value. Clicking it clears the input. Defaults to `false`.                                                                                                                                                                                                                           | `boolean`                                                                             |
| `clearOnEdit`    | `clear-on-edit`  | If `true`, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.                                                                                                                                                                                                             | `boolean \| undefined`                                                                |
| `color`          | `color`          | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics).                                                                               | `string \| undefined`                                                                 |
| `debounce`       | `debounce`       | Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke. Default `0`.                                                                                                                                                                                                                                 | `number`                                                                              |
| `disabled`       | `disabled`       | If `true`, the user cannot interact with the input. Defaults to `false`.                                                                                                                                                                                                                                                                             | `boolean`                                                                             |
| `inputmode`      | `inputmode`      | A hint to the browser for which keyboard to display. This attribute applies when the value of the type attribute is `"text"`, `"password"`, `"email"`, or `"url"`. Possible values are: `"verbatim"`, `"latin"`, `"latin-name"`, `"latin-prose"`, `"full-width-latin"`, `"kana"`, `"katakana"`, `"numeric"`, `"tel"`, `"email"`, `"url"`.            | `string \| undefined`                                                                 |
| `max`            | `max`            | The maximum value, which must not be less than its minimum (min attribute) value.                                                                                                                                                                                                                                                                    | `string \| undefined`                                                                 |
| `maxlength`      | `maxlength`      | If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.                                                                                                                                                                     | `number \| undefined`                                                                 |
| `min`            | `min`            | The minimum value, which must not be greater than its maximum (max attribute) value.                                                                                                                                                                                                                                                                 | `string \| undefined`                                                                 |
| `minlength`      | `minlength`      | If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.                                                                                                                                                                     | `number \| undefined`                                                                 |
| `mode`           | `mode`           | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                                                                                                            | `"ios" \| "md"`                                                                       |
| `multiple`       | `multiple`       | If `true`, the user can enter more than one value. This attribute applies when the type attribute is set to `"email"` or `"file"`, otherwise it is ignored.                                                                                                                                                                                          | `boolean \| undefined`                                                                |
| `name`           | `name`           | The name of the control, which is submitted with the form data.                                                                                                                                                                                                                                                                                      | `string`                                                                              |
| `pattern`        | `pattern`        | A regular expression that the value is checked against. The pattern must match the entire value, not just some subset. Use the title attribute to describe the pattern to help the user. This attribute applies when the value of the type attribute is `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored. | `string \| undefined`                                                                 |
| `placeholder`    | `placeholder`    | Instructional text that shows before the input has a value.                                                                                                                                                                                                                                                                                          | `string \| undefined`                                                                 |
| `readonly`       | `readonly`       | If `true`, the user cannot modify the value. Defaults to `false`.                                                                                                                                                                                                                                                                                    | `boolean`                                                                             |
| `required`       | `required`       | If `true`, the user must fill in a value before submitting a form.                                                                                                                                                                                                                                                                                   | `boolean`                                                                             |
| `results`        | `results`        | This is a nonstandard attribute supported by Safari that only applies when the type is `"search"`. Its value should be a nonnegative decimal integer.                                                                                                                                                                                                | `number \| undefined`                                                                 |
| `size`           | `size`           | The initial size of the control. This value is in pixels unless the value of the type attribute is `"text"` or `"password"`, in which case it is an integer number of characters. This attribute applies only when the `type` attribute is set to `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.       | `number \| undefined`                                                                 |
| `spellcheck`     | `spellcheck`     | If `true`, the element will have its spelling and grammar checked. Defaults to `false`.                                                                                                                                                                                                                                                              | `boolean`                                                                             |
| `step`           | `step`           | Works with the min and max attributes to limit the increments at which a value can be set. Possible values are: `"any"` or a positive floating point number.                                                                                                                                                                                         | `string \| undefined`                                                                 |
| `type`           | `type`           | The type of control to display. The default type is text. Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.                                                                                                                                                                                       | `"date" \| "email" \| "number" \| "password" \| "search" \| "tel" \| "text" \| "url"` |
| `value`          | `value`          | The value of the input.                                                                                                                                                                                                                                                                                                                              | `string`                                                                              |


## Events

| Event               | Detail               | Description                              |
| ------------------- | -------------------- | ---------------------------------------- |
| `ionBlur`           |                      | Emitted when the input loses focus.      |
| `ionChange`         | TextInputChangeEvent | Emitted when the value has changed.      |
| `ionFocus`          |                      | Emitted when the input has focus.        |
| `ionInput`          | KeyboardEvent        | Emitted when a keyboard input ocurred.   |
| `ionInputDidLoad`   |                      | Emitted when the input has been created. |
| `ionInputDidUnload` |                      | Emitted when the input has been removed. |
| `ionStyle`          | StyleEvent           | Emitted when the styles change.          |


## Methods

### `setFocus() => void`

Sets focus on the specified `ion-input`. Use this method instead of the global
`input.focus()`.

#### Returns

Type: `void`




## CSS Custom Properties

| Name                        | Description                               |
| --------------------------- | ----------------------------------------- |
| `--background`              | Background of the input                   |
| `--color`                   | Color of the input text                   |
| `--padding-bottom`          | Bottom padding of the input               |
| `--padding-end`             | End padding of the input                  |
| `--padding-start`           | Start padding of the input                |
| `--padding-top`             | Top padding of the input                  |
| `--placeholder-color`       | Color of the input placeholder text       |
| `--placeholder-font-style`  | Font style of the input placeholder text  |
| `--placeholder-font-weight` | Font weight of the input placeholder text |
| `--placeholder-opacity`     | Opacity of the input placeholder text     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
