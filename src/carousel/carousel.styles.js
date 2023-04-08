import { css } from "lit";

export default css`
  :host {
    box-sizing: border-box;
    display: grid;
    gap: var(--lightbox-grid-gap, 1rem);
    grid-template-columns: repeat(auto-fill, minmax(var(--lightbox-size, 16rem), 1fr));
    grid-template-rows: masonry;
    justify-items: center;
  }

  *,
  *::after,
  *::before {
    box-sizing: inherit;
  }
`;
