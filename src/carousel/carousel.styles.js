import { css } from "lit";

export default css`
  :host {
    box-sizing: border-box;
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(var(--lightbox-size, 16rem), 1fr));
    grid-template-rows: masonry;
    justify-items: center;
  }

  *,
  *::after,
  *::before {
    box-sizing: inherit;
  }

  ::slotted(light-box:first-of-type) {
    inline-size: 100%;
    max-block-size: 30rem;
  }

  @media (min-width: 37.5rem) {
    ::slotted(light-box:first-of-type) {
      grid-column: 1 / 3;
    }
  }
`;
