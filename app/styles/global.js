import { css } from "@emotion/core";

import {typography} from "components/typography";

const {
    lineHeightComputed,
    fontSize_h1_unit,
    fontSize_h2_unit,
    fontSize_h3_unit,
    fontSize_h4_unit,
    fontSize_h5_unit,
    fontSize_h6_unit,
} = typography();

export const GlobalStyles = css`
html {
  line-height: 1.15;
}
body {
  font-size: 1rem;
  line-height: 1.5;
}
/* Relative Type Scale */
/* https://blog.envylabs.com/responsive-typographic-scales-in-css-b9f60431d1c4 */
:root {
  --step-up-5: 2em;
  --step-up-4: 1.7511em;
  --step-up-3: 1.5157em;
  --step-up-2: 1.3195em;
  --step-up-1: 1.1487em;
  /* baseline: 1em */
  --step-down-1: 0.8706em;
  --step-down-2: 0.7579em;
  --step-down-3: 0.6599em;
  --step-down-4: 0.5745em;
  --step-down-5: 0.5em;
  /* Colors */
  --header: rgb(0,0,0);
}/* https://css-tricks.com/snippets/css/system-font-stack/ */
/* Define the "system" font family */
/* Fastest loading font - the one native to their device */
/* Modern CSS Reset */
/* https://alligator.io/css/minimal-css-reset/ */
body, h1, h2, h3, h4, h5, h6, p, ol, ul, input[type=text], input[type=email], button {
  margin: 0;
  padding: 0;
  font-weight: normal;
}body, h1, h2, h3, h4, h5, h6, p, ol, ul, input[type=text], input[type=email], select, button { /* stylelint-disable-line no-duplicate-selectors */
  font-weight: 300;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
}*, *:before, *:after {
  box-sizing: inherit;
}ol, ul {
  list-style: none;
}img {
  max-width: 100%;
  height: auto;
}/* Links */
a {
  text-decoration: underline;
  color: inherit;
}

.react-expand-collapse__content {
  position: relative;
  overflow: hidden;
}

.react-expand-collapse__body {
  display: inline;
}

/* expand-collapse button */
.react-expand-collapse__button {
  color: #22a7f0;
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #fff;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.react-expand-collapse__button:before {
  content: '';
  position: absolute;
  top: 0;
  left: -20px;
  width: 20px;
  height: 100%;
  background: linear-gradient(to right, transparent 0, #fff 100%);
}

/* expanded state */
.react-expand-collapse--expanded .react-expand-collapse__button {
  padding-left: 5px;
  position: relative;
  bottom: auto;
  right: auto;
}

.react-expand-collapse--expanded .react-expand-collapse__button:before {
  content: none;
}

article {
    h1, h2, h3, h4, h5, h6 {
      color: #555;
    }
    
    h1,
    h2,
    h3 {
      margin-bottom: ${lineHeightComputed / 2}rem;
    }
    
    h2,
    h3 {
      margin-top: ${lineHeightComputed}rem;
    }
    
    h4,
    h5,
    h6 {
      margin-top: ${lineHeightComputed / 2}rem;
      margin-bottom: ${lineHeightComputed / 2}rem;
    }
    
    h1 {
      font-size: ${fontSize_h1_unit};
    }
    h2 {
      font-size: ${fontSize_h2_unit};
    }
    h3 {
      font-size: ${fontSize_h3_unit};
    }
    h4 {
      font-size: ${fontSize_h4_unit};
    }
    h5 {
      font-size: ${fontSize_h5_unit};
    }
    h6 {
      font-size: ${fontSize_h6_unit};
    }

    p {
        margin-top: 0;
        margin-bottom: 1rem;
    }
}

.align-right {
  text-align: right;
}
`;
