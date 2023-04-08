import { LitElement, html } from "lit";
import TinyGesture from "tinygesture";
import styles from "./carousel.styles";

/**
 * @element lightbox-carousel
 * @summary Transforms a set of `<light-box>` elements into a carousel-like presentation.
 *
 * @slot - Default slot for lightboxes.
 *
 * @cssprop --lightbox-size - Min inline size of each lightbox in the grid.
 * @cssprop --lightbox-grid-gap - Gap space between lightboxes in the grid.
 */
export class LightboxCarousel extends LitElement {
  static styles = styles;

  static get properties() {
    return {
      activeLightbox: { state: true },
      open: { state: true },
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

  #handleKeyup = (e) => {
    const index =
      e.key === "ArrowRight"
        ? this.activeLightbox.index + 1
        : e.key === "ArrowLeft"
        ? this.activeLightbox.index - 1
        : false;
    this.#handleChangingLightboxes(index);
  };

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

    document.addEventListener("keyup", this.#handleKeyup);
    this.gesture.on("swiperight", this.#handleSwipeRight);
    this.gesture.on("swipeleft", this.#handleSwipeLeft);
  };

  #lightboxClosedEvent = () => {
    this.activeLightbox = null;
    document.removeEventListener("keyup", this.#handleKeyup);
    this.gesture.off("swiperight");
    this.gesture.off("swipeleft");
  };

  render() {
    return html`<slot></slot>`;
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

customElements.define("lightbox-carousel", LightboxCarousel);
