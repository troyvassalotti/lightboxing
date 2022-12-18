import { css } from "lit";

export default css`
  :host {
    box-sizing: border-box;
  }

  *,
  *::after,
  *::before {
    box-sizing: inherit;
  }

  ::slotted([height]) {
    block-size: auto;
  }

  ::slotted(*) {
    cursor: zoom-in;
    inline-size: inherit;
    object-fit: cover;
  }

  .shadow {
    background-color: rgba(0, 0, 0, 0.8);
    block-size: 100vh;
    cursor: zoom-out;
    inline-size: 100%;
    inset: 0;
    overflow: auto;
    padding: 1rem;
    place-items: center;
    position: fixed;
  }

  .open {
    display: grid;
  }

  .closed {
    display: none;
  }

  .shadow :first-child {
    block-size: auto;
    display: block;
    max-inline-size: 100%;
  }
`;
