# ion-reorder-group

The reorder group is a wrapper component for items with the `ion-reorder` component, Check [Reorder documentation](../reorder/) for further information about the anchor component that is used to drag items within the `ion-reorder-group` list.

Once the user drags an item and drops it in a new position, the `ionItemReorder` event is dispatched. A handler for it must be implemented by the developer to commit changes.

```js
reorderGroup.addEventListener('ionItemReorder', (ev) => {
  console.log(`Moving item from ${ev.detail.from} to ${ev.detail.to}`);

  this.dataList = reorderArray(this.dataList, ev.detail.from, ev.detail.to);
  ev.detail.complete();
});
```

The event's detail includes all the relevant information about the reorder operation, including the `from` and `to` indexes. The meaning of this indexes are pretty self-explanatory, the item **from** index X, moved **to** the index Y.

For example, in this list we move the item at index `0` to the index `3`:

```
BEFORE | AFTER
  0    |   1
  1    |   2
  2    |   3
  3    |   0
  4    |   4
```

```
detail: {
  from: 0
  to: 3
}
```

Once the data structure has been updated to reflect the reorder change, the `complete()` method must be called.
This method finishes the reorder operation and resets all the CSS transforms applied by the `ion-reorder-group` component.

Fortunately this `complete()` method can optionally accept an array as input and it will return a reordered copy, based in `detail.from` and `detail.to`.

```ts
this.dataList = reorderGroup.complete(this.dataList);
```

This utility is really handy when



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                | Type      |
| ---------- | ---------- | ---------------------------------------------------------- | --------- |
| `disabled` | `disabled` | If `true`, the reorder will be hidden. Defaults to `true`. | `boolean` |


## Events

| Event            | Detail            | Description                                                                                                                                                                                          |
| ---------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ionItemReorder` | ItemReorderDetail | Event that needs to be listen to in order to respond to reorder action. `ion-reorder-group` uses this event to delegate to the user the reordering of data array.   The complete() method exposed as |


## Methods

### `complete(listOrReorder?: boolean | any[] | undefined) => Promise<any>`

This method must be called once the `ionItemReorder` event is handled in order
to complete the reorder operation.

#### Parameters

| Name            | Type                            | Description |
| --------------- | ------------------------------- | ----------- |
| `listOrReorder` | `any[] \| boolean \| undefined` |             |

#### Returns

Type: `Promise<any>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
