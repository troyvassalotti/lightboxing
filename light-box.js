/** @format */

import {html, css, LitElement} from "lit";

/**
 * @element light-box
 * @summary Create a lightbox for your slotted media.
 *
 * @attr {Boolean} open - The open/closed state of the lightbox.
 *
 * @prop {HTMLElement} image - The slotted media.
 *
 * @fires LightboxOpened
 * @fires LightboxClosed
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

			::slotted(*) {
				cursor: zoom-in;
				inline-size: inherit;
				object-fit: cover;
			}

			::slotted([height]) {
				block-size: auto;
			}

			dialog::backdrop {
				background-color: rgba(0, 0, 0, 0.8);
			}

			dialog img {
				block-size: auto;
				display: block;
				max-inline-size: 100%;
			}
		`;
	}

	static get properties() {
		return {
			image: {state: true},
			open: {type: Boolean, reflect: true},
			navigation: {type: Boolean, reflect: true},
		};
	}

	constructor() {
		super();
		this.image;
		this.open = false;
		this.hasNavigation = false;
	}

	get #dialog() {
		return this.shadowRoot.querySelector("dialog");
	}

	openLightbox() {
		this.#dialog.showModal();
	}

	closeLightbox() {
		this.#dialog.close();
	}

	#handleSlot(event) {
		this.image = event.target
			.assignedElements({flatten: true})[0]
			.cloneNode(true);
	}

	setDialogObserver() {
		const dialogObserver = new MutationObserver((mutationList) => {
			for (const mutation of mutationList) {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "open"
				) {
					this.open = this.#dialog.open;

					if (this.open) {
						this.dispatchEvent(
							new CustomEvent("LightboxOpened", {
								bubbles: true,
								composed: false,
							}),
						);
					} else {
						this.dispatchEvent(
							new CustomEvent("LightboxClosed", {
								bubbles: true,
								composed: false,
							}),
						);
					}
				}
			}
		});

		dialogObserver.observe(this.#dialog, {attributes: true});
	}

	render() {
		return html`
			<slot
				@click=${this.openLightbox}
				@slotchange=${this.#handleSlot}></slot>
			<dialog>
				<button @click=${this.closeLightbox}>Close</button>
				${this.navigation
					? html`
							<button>Previous</button>
							<button>Next</button>
						`
					: html``}
				${this.image}
			</dialog>
		`;
	}

	firstUpdated() {
		this.setDialogObserver();
	}
}

window.customElements.define("light-box", Lightbox);
