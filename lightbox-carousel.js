/** @format */

import {LitElement, html, css} from "lit";

/**
 * @element lightbox-carousel
 * @summary Transforms a set of `<light-box>` elements into a carousel-like presentation.
 *
 * @slot - Default slot for lightboxes.
 *
 * @cssprop --lightbox-size - Min inline size of each lightbox in the grid.
 */
export default class LightboxCarousel extends LitElement {
	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				display: grid;
				gap: 1rem;
				grid-template-columns: repeat(
					auto-fill,
					minmax(var(--lightbox-size, 14rem), 1fr)
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

	constructor() {
		super();
		this.previousLightbox = null;
		this.nextLightbox = null;
	}

	/** All child light-box elements. */
	get lightboxes() {
		return Array.from(this.querySelectorAll("light-box"));
	}

	get #previousLightbox() {
		return this.previousLightbox;
	}

	set #previousLightbox(target) {
		const previous = this.lightboxes.find(
			(node) => node.carouselIndex === target.carouselIndex - 1,
		);

		this.previousLightbox =
			previous ?? this.lightboxes[this.lightboxes.length - 1];
	}

	get #nextLightbox() {
		return this.nextLightbox;
	}

	set #nextLightbox(target) {
		const next = this.lightboxes.find(
			(node) => node.carouselIndex === target.carouselIndex + 1,
		);

		this.nextLightbox = next ?? this.lightboxes[0];
	}

	#handleOpenLightbox({target}) {
		this.open = true;
		this.#nextLightbox = target;
		this.#previousLightbox = target;
	}

	#handlePreviousLightbox({target}) {
		this.#previousLightbox.open();
		target.close();
	}

	#handleNextLightbox({target}) {
		this.#nextLightbox.open();
		target.close();
	}

	#handleSlot() {
		this.lightboxes.forEach((box, index) => {
			box.navigation = true;
			box.carouselIndex = index;
		});
	}

	render() {
		return html`<slot @slotchange=${this.#handleSlot}></slot>`;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("light-box-open", this.#handleOpenLightbox);
		this.addEventListener("light-box-previous", this.#handlePreviousLightbox);
		this.addEventListener("light-box-next", this.#handleNextLightbox);
	}
}

window.customElements.define("lightbox-carousel", LightboxCarousel);
