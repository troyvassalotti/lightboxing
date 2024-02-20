/** @format */

import {LitElement, html, css} from "lit";
import TinyGesture from "tinygesture";

/**
 * @element lightbox-carousel
 * @summary Transforms a set of `<light-box>` elements into a carousel-like presentation.
 *
 * @slot - Default slot for lightboxes.
 *
 * @cssprop --lightbox-size - Min inline size of each lightbox in the grid.
 * @cssprop --lightbox-grid-gap - Gap space between lightboxes in the grid.
 */
export default class LightboxCarousel extends LitElement {
	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				display: grid;
				gap: var(--lightbox-grid-gap, 1rem);
				grid-template-columns: repeat(
					auto-fill,
					minmax(var(--lightbox-size, 16rem), 1fr)
				);
				grid-template-rows: masonry;
				justify-items: center;
			}

			*,
			*::after,
			*::before {
				box-sizing: inherit;
			}
		`;
	}

	static get properties() {
		return {
			activeLightbox: {state: true},
			open: {state: true},
		};
	}

	constructor() {
		super();
		this.activeLightbox;
		this.gesture = new TinyGesture(this);
	}

	get #lightboxes() {
		return this.querySelectorAll("light-box");
	}

	#handleSwipeLeft = () => {
		const index = this.activeLightbox.index + 1;
		this.#handleChangingLightboxes(index);
	};

	#handleSwipeRight = () => {
		const index = this.activeLightbox.index - 1;
		this.#handleChangingLightboxes(index);
	};

	#handleChangingLightboxes = (index) => {
		for (const node of this.#lightboxes.entries()) {
			if (node[0] === index) {
				this.activeLightbox.node.closeLightbox();
				node[1].openLightbox();
			}
		}
	};

	#lightboxOpenedEvent = () => {
		this.#lightboxes.forEach((node, index) => {
			if (node.open) {
				this.activeLightbox = {
					node,
					index,
				};
			}
		});

		this.gesture.on("swiperight", this.#handleSwipeRight);
		this.gesture.on("swipeleft", this.#handleSwipeLeft);
	};

	#lightboxClosedEvent = () => {
		this.activeLightbox = null;
		this.gesture.off("swiperight");
		this.gesture.off("swipeleft");
	};

	handleSlotchange() {
		this.#lightboxes.forEach((box) => (box.navigation = true));
	}

	render() {
		return html`<slot @slotchange=${this.handleSlotchange}></slot>`;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("LightboxOpened", this.#lightboxOpenedEvent);
		this.addEventListener("LightboxClosed", this.#lightboxClosedEvent);
	}

	disconnectedCallback() {
		gesture.destroy();
		super.disconnectedCallback();
	}
}

window.customElements.define("lightbox-carousel", LightboxCarousel);
