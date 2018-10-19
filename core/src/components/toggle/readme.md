# ion-toggle

Toggles change the state of a single option. Toggles can be switched on or off by pressing or swiping them. They can also be checked programmatically by setting the `checked` property.



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type                  |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `checked`  | `checked`  | If `true`, the toggle is selected. Defaults to `false`.                                                                                                                                                                                                                | `boolean`             |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined` |
| `disabled` | `disabled` | If `true`, the user cannot interact with the toggle. Default false.                                                                                                                                                                                                    | `boolean`             |
| `mode`     | `mode`     | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `"ios" \| "md"`       |
| `name`     | `name`     | The name of the control, which is submitted with the form data.                                                                                                                                                                                                        | `string`              |
| `value`    | `value`    | the value of the toggle.                                                                                                                                                                                                                                               | `string`              |


## Events

| Event       | Detail                  | Description                                  |
| ----------- | ----------------------- | -------------------------------------------- |
| `ionBlur`   |                         | Emitted when the toggle loses focus.         |
| `ionChange` | CheckedInputChangeEvent | Emitted when the value property has changed. |
| `ionFocus`  |                         | Emitted when the toggle has focus.           |
| `ionStyle`  | StyleEvent              | Emitted when the styles change.              |


## CSS Custom Properties

| Name                          | Description                                  |
| ----------------------------- | -------------------------------------------- |
| `--background`                | Background of the toggle                     |
| `--background-checked`        | Background of the toggle when checked        |
| `--handle-background`         | Background of the toggle handle              |
| `--handle-background-checked` | Background of the toggle handle when checked |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
