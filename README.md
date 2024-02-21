<!-- @format -->

# `<light-box>` & `<lightbox-carousel>`

A series of web components for turning images into lightboxes with an optional carousel wrapper.

## Installation

Via npm: `npm install @troyv/lightboxing`.

Via ESM:

```html
<script type="module">
	// You can import all at once or single components
	import {Lightbox, LightboxCarousel} from "https://esm.sh/@troyv/lightboxing";
	import Lightbox from "https://esm.sh/@troyv/lightboxing/light-box.js";
	import LightboxCarousel from "https://esm.sh/@troyv/lightboxing/lightbox-carousel.js";
</script>
```

## Usage

You either need a bundling solution that will handle the bare module imports from `lit` or you need to use import maps in the browser.

```html
<!-- for browsers that don't natively support import maps -->
<script
	async
	src="https://esm.sh/es-module-shims"></script>
<script type="importmap">
	{
		"imports": {
			"lit": "https://esm.sh/lit"
		}
	}
</script>
<script
	type="module"
	src="type-writer.js"></script>
```

Since all elements are slotted, it is _up to you_ to create your ideal responsive media styles in your site or application. Reasonable defaults are applied when possible, but do not rely solely on the components to make your images responsive.

### `<light-box>`

Slot in a `<button>` with your preferred media element - `img` or `picture`. Clicking on your image will open a lightbox.

### `<lightbox-carousel>`

Slot in a set of `<light-box>` components to be able to navigate between them while the lightbox is open. The minimum inline size of each lightbox in the grid can be changed with the CSS custom property `--lightbox-size`.
