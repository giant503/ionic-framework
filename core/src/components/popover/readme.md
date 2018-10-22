# ion-popover

A Popover is a dialog that appears on top of the current page. It can be used for anything, but generally it is used for overflow actions that don't fit in the navigation bar.

### Creating

Popovers can be created using a [Popover Controller](https://beta.ionicframework.com/docs/api/popover-controller). They can be customized by passing popover options in the popover controller's create method.

### Presenting

To present a popover, call the `present` method on a popover instance. In order to position the popover relative to the element clicked, a click event needs to be passed into the options of the the `present` method. If the event is not passed, the popover will be positioned in the center of the viewport.


<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                                      | Type                                        |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `animated`        | `animated`         | If `true`, the popover will animate. Defaults to `true`.                                                         | `boolean`                                   |
| `backdropDismiss` | `backdrop-dismiss` | If `true`, the popover will be dismissed when the backdrop is clicked. Defaults to `true`.                       | `boolean`                                   |
| `componentProps`  | --                 | The data to pass to the popover component.                                                                       | `undefined \| { [key: string]: any; }`      |
| `component`       | `component`        | The component to display inside of the popover.                                                                  | `Function \| HTMLElement \| null \| string` |
| `cssClass`        | `css-class`        | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. | `string \| string[] \| undefined`           |
| `delegate`        | --                 |                                                                                                                  | `FrameworkDelegate \| undefined`            |
| `enterAnimation`  | --                 | Animation to use when the popover is presented.                                                                  | `AnimationBuilder \| undefined`             |
| `event`           | --                 | The event to pass to the popover animation.                                                                      | `any`                                       |
| `keyboardClose`   | `keyboard-close`   | If `true`, the keyboard will be automatically dismissed when the overlay is presented.                           | `boolean`                                   |
| `leaveAnimation`  | --                 | Animation to use when the popover is dismissed.                                                                  | `AnimationBuilder \| undefined`             |
| `mode`            | `mode`             | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                        | `"ios" \| "md"`                             |
| `overlayIndex`    | `overlay-index`    |                                                                                                                  | `number`                                    |
| `showBackdrop`    | `show-backdrop`    | If `true`, a backdrop will be displayed behind the popover. Defaults to `true`.                                  | `boolean`                                   |
| `translucent`     | `translucent`      | If `true`, the popover will be translucent. Defaults to `false`.                                                 | `boolean`                                   |


## Events

| Event                   | Detail             | Description                               |
| ----------------------- | ------------------ | ----------------------------------------- |
| `ionPopoverDidDismiss`  | OverlayEventDetail | Emitted after the popover has dismissed.  |
| `ionPopoverDidLoad`     |                    | Emitted after the popover has loaded.     |
| `ionPopoverDidPresent`  |                    | Emitted after the popover has presented.  |
| `ionPopoverDidUnload`   |                    | Emitted after the popover has unloaded.   |
| `ionPopoverWillDismiss` | OverlayEventDetail | Emitted before the popover has dismissed. |
| `ionPopoverWillPresent` |                    | Emitted before the popover has presented. |


## Methods

### `dismiss(data?: any, role?: string | undefined) => Promise<boolean>`

Dismiss the popover overlay after it has been presented.

#### Parameters

| Name   | Type                  | Description |
| ------ | --------------------- | ----------- |
| `data` | `any`                 |             |
| `role` | `string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `onDidDismiss() => Promise<OverlayEventDetail<any>>`

Returns a promise that resolves when the popover did dismiss.

#### Returns

Type: `Promise<OverlayEventDetail<any>>`



### `onWillDismiss() => Promise<OverlayEventDetail<any>>`

Returns a promise that resolves when the popover will dismiss.

#### Returns

Type: `Promise<OverlayEventDetail<any>>`



### `present() => Promise<void>`

Present the popover overlay after it has been created.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
