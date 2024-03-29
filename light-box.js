/** @format */

import {html, css, LitElement} from "lit";

/**
 * @element light-box
 * @summary Create a lightbox for your slotted media.
 *
 * @slot - Default slot for img` or `picture` elements, or anything containing a picture, really.
 * @slot lightbox - Slot in a different image than initially seen for the lightbox.
 *
 * @attr {boolean} illuminated - The open/closed state of the lightbox.
 * @attr {boolean} navigation - Lightbox uses navigation within a carousel.
 *
 * @prop {number} carouselindex - Position of the light-box in a carousel.
 * @prop {HTMLElement} image - The slotted media.
 *
 * @fires light-box-open
 * @fires light-box-close
 * @fires light-box-previous
 * @fires light-box-next
 */
export default class Lightbox extends LitElement {
	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				display: inline-block;
			}

			*,
			*::after,
			*::before {
				box-sizing: inherit;
			}

			.trigger {
				appearanece: none;
				background-color: transparent;
				border: none;
				cursor: zoom-in;
				padding: 0;
			}

			.close-container {
				display: flex;
				justify-content: end;
			}

			dialog::backdrop {
				background-color: rgba(0, 0, 0, 0.8);
			}

			dialog .content {
				display: grid;
				gap: 1rem;
			}

			dialog :is(picture, img) {
				block-size: auto;
				display: block;
				inline-size: 100%;
				max-inline-size: 100%;
			}

			.navigation {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
			}

			button:not(.trigger) {
				cursor: pointer;
			}
		`;
	}

	static get properties() {
		return {
			image: {state: true},
			illuminated: {type: Boolean, reflect: true},
			navigation: {type: Boolean, reflect: true},
			carouselIndex: {type: Number},
		};
	}

	constructor() {
		super();
		this.image;
		this.illuminated = false;
		this.navigation = false;
		this.carouselIndex = 0;
	}

	/**
	 * Dialog element in the shadow root.
	 * @type {HTMLDialogElement}
	 */
	get #dialog() {
		return this.shadowRoot.querySelector("dialog");
	}

	/** Helper for emitting custom events on interaction. */
	emitEvent(eventName) {
		this.dispatchEvent(
			new CustomEvent(eventName, {
				bubbles: true,
				composed: false,
			}),
		);
	}

	/** Open the lightbox. */
	open = () => {
		this.#dialog.showModal();
	};

	/** Close the lightbox. */
	close = () => {
		this.#dialog.close();
	};

	/** Emit event signaling a backwards navigation. */
	previousLightbox() {
		this.emitEvent("light-box-previous");
	}

	/** Emit event signaling a forwards navigation. */
	nextLightbox() {
		this.emitEvent("light-box-next");
	}

	/**
	 * Create and activate a mutation observer on the dialog element to watch for changes to its open state.
	 *
	 * @returns {MutationObserver}
	 */
	setDialogObserver() {
		const dialogObserver = new MutationObserver((mutationList) => {
			for (const {type, attributeName} of mutationList) {
				if (type === "attributes" && attributeName === "open") {
					this.illuminated = this.#dialog.open;

					this.illuminated
						? this.emitEvent("light-box-open")
						: this.emitEvent("light-box-close");
				}
			}
		});

		dialogObserver.observe(this.#dialog, {attributes: true});

		return dialogObserver;
	}

	/** Sets image state on slot change. */
	#handleSlot(event) {
		const slottedElements = event.target.assignedElements({flatten: true});
		const firstElement = slottedElements[0];

		this.image = firstElement?.cloneNode(true);

		return this.image;
	}

	render() {
		return html`
			<button
				class="trigger"
				@click=${this.open}>
				<slot @slotchange=${this.#handleSlot}></slot>
			</button>
			<dialog part="lightbox-dialog">
				<div
					part="dialog-content"
					class="content">
					<div
						part="close-container"
						class="close-container">
						<button
							part="close-button"
							@click=${this.close}>
							Close
						</button>
					</div>
					<slot name="lightbox">${this.image}</slot>
					${this.navigation
						? html`
								<div class="navigation">
									<button
										part="previous-button"
										@click=${this.previousLightbox}>
										&lt; Previous
									</button>
									<button
										part="next-button"
										@click=${this.nextLightbox}>
										Next &gt;
									</button>
								</div>
							`
						: html``}
				</div>
			</dialog>
		`;
	}

	firstUpdated() {
		this.setDialogObserver();
	}
}

window.customElements.define("light-box", Lightbox);
