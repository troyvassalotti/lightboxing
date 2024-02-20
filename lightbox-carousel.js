/** @format */

import {LitElement, html, css} from "lit";

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
			activeLightbox: {state: true, type: Object},
			open: {state: true},
		};
	}

	constructor() {
		super();
		this.activeLightbox;
	}

	get #lightboxes() {
		return this.querySelectorAll("light-box");
	}

	#handlePreviousLightbox = () => {
		const index = this.activeLightbox.index + 1;
		this.#handleChangingLightboxes(index);
	};

	#handleNextLightbox = () => {
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

	#handleOpenedLightbox = () => {
		this.#lightboxes.forEach((node, index) => {
			if (node.open) {
				this.activeLightbox = {
					node,
					index,
				};
			}
		});
	};

	/**
	 * @todo this is returning null in navigation and you can only navigate between two before it breaks
	 */
	#handleClosedLightbox = () => {
		this.activeLightbox = null;
	};

	handleSlotchange() {
		this.#lightboxes.forEach((box) => (box.navigation = true));
	}

	render() {
		return html`<slot @slotchange=${this.handleSlotchange}></slot>`;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("LightboxOpened", this.#handleOpenedLightbox);
		this.addEventListener("LightboxClosed", this.#handleClosedLightbox);
		this.addEventListener("LightboxPrevious", this.#handlePreviousLightbox);
		this.addEventListener("LightboxNext", this.#handleNextLightbox);
	}
}

window.customElements.define("lightbox-carousel", LightboxCarousel);
