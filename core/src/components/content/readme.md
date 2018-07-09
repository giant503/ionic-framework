# ion-content

Content component provides an easy to use content area with some useful methods
to control the scrollable area. There should only be one content in a single
view component.

<!-- Auto Generated Below -->


## Properties

#### color

string


#### forceOverscroll

boolean

If true and the content does not cause an overflow scroll, the scroll interaction will cause a bounce.
If the content exceeds the bounds of ionContent, nothing will change.
Note, the does not disable the system bounce on iOS. That is an OS level setting.


#### fullscreen

boolean

If true, the content will scroll behind the headers
and footers. This effect can easily be seen by setting the toolbar
to transparent.


#### scrollEnabled

boolean

By default `ion-content` uses an `ion-scroll` under the hood to implement scrolling,
if you want to disable the content scrolling for a given page, set this property to `false`.


#### scrollEvents

boolean

Because of performance reasons, ionScroll events are disabled by default, in order to enable them
and start listening from (ionScroll), set this property to `true`.


## Attributes

#### color

string


#### force-overscroll

boolean

If true and the content does not cause an overflow scroll, the scroll interaction will cause a bounce.
If the content exceeds the bounds of ionContent, nothing will change.
Note, the does not disable the system bounce on iOS. That is an OS level setting.


#### fullscreen

boolean

If true, the content will scroll behind the headers
and footers. This effect can easily be seen by setting the toolbar
to transparent.


#### scroll-enabled

boolean

By default `ion-content` uses an `ion-scroll` under the hood to implement scrolling,
if you want to disable the content scrolling for a given page, set this property to `false`.


#### scroll-events

boolean

Because of performance reasons, ionScroll events are disabled by default, in order to enable them
and start listening from (ionScroll), set this property to `true`.


## Methods

#### getScrollElement()



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
