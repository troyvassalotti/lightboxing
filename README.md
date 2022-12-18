# `<light-box>` & `<lightbox-carousel>`

A series of web components for turning images into lightboxes with an optional carousel wrapper.

## Installation

Via npm: `npm install @troyv/lightboxing`.

## Usage

Since all elements are slotted, it is _up to you_ to create your ideal responsive media styles in your site or application. Reasonable defaults are applied when possible, but do not rely solely on the components to make your images responsive.

### `<light-box>`

Slot in your preferred media element - `img` or `picture`. Clicking on your image will open a lightbox.

### `<lightbox-carousel>`

Slot in a set of `<light-box>` components to be able to navigate between them while the lightbox is open. The minimum inline size of each lightbox in the grid can be changed with the CSS custom property `--lightbox-size`.
