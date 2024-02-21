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

	/** All child light-box elements. */
	get lightboxes() {
		return Array.from(this.querySelectorAll("light-box"));
	}

	#handlePreviousLightbox({target}) {
		const previous = this.lightboxes.find(
			(node) => node.carouselIndex === target.carouselIndex - 1,
		);

		if (previous) {
			previous.open();
		} else {
			// open the last lightbox instead
			this.lightboxes[this.lightboxes.length - 1].open();
		}

		target.close();
	}

	#handleNextLightbox({target}) {
		const next = this.lightboxes.find(
			(node) => node.carouselIndex === target.carouselIndex + 1,
		);

		if (next) {
			next.open();
		} else {
			// open the first lightbox instead
			this.lightboxes[0].open();
		}

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
		this.addEventListener("light-box-previous", this.#handlePreviousLightbox);
		this.addEventListener("light-box-next", this.#handleNextLightbox);
	}
}

window.customElements.define("lightbox-carousel", LightboxCarousel);
