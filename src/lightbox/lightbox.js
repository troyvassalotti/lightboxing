import { html, LitElement } from "lit";
import styles from "./lightbox.styles";

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
export class Lightbox extends LitElement {
  static styles = styles;

  static get properties() {
    return {
      image: { state: true },
      open: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.image;
    this.open = false;
  }

  get #openClass() {
    return this.open ? "open" : "closed";
  }

  #handleDocument(open) {
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", this.#handleEscape);
    } else {
      document.body.style.overflow = "initial";
      document.removeEventListener("keydown", this.#handleEscape);
    }
  }

  openLightbox() {
    this.open = true;
    this.#handleDocument(true);
    this.dispatchEvent(new CustomEvent("LightboxOpened", { bubbles: true, composed: false }));
  }

  closeLightbox() {
    this.open = false;
    this.#handleDocument(false);
    this.dispatchEvent(new CustomEvent("LightboxClosed", { bubbles: true, composed: false }));
  }

  #handleEscape = (event) => {
    if (event.key === "Escape" || event.key === "Esc") {
      this.closeLightbox();
    }
  };

  #handleSlot(event) {
    this.image = event.target.assignedElements({ flatten: true })[0];
  }

  #createLightbox() {
    if (this.image) {
      const image = this.image.cloneNode(true);
      return html`<div class="shadow ${this.#openClass}" @click=${this.closeLightbox}>
        ${image}
      </div>`;
    }
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.#handleEscape);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <slot @click=${this.openLightbox} @slotchange=${this.#handleSlot}></slot>
      ${this.#createLightbox()}
    `;
  }
}

customElements.define("light-box", Lightbox);
