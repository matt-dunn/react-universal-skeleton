import styled from "@emotion/styled";

import inconsolata from "./fonts/inconsolata-regular.ttf";

import {typography} from "components/typography";

const {
    lineHeightComputed,
    fontSizeBase_unit,
    fontSize_h1_unit,
    fontSize_h2_unit,
    fontSize_h3_unit,
    fontSize_h4_unit,
    fontSize_h5_unit,
    fontSize_h6_unit,
    lineHeightBase
} = typography(1.6);

export const Container = styled.article`
    @font-face {
      font-family: 'Inconsolata';
      src: url(${inconsolata}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    font-family: inherit;
    line-height: ${lineHeightBase};
    font-size: ${fontSizeBase_unit};
    color: #555;
    text-align: left;
    font-weight: normal;
    //pointer-events: none;
    
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
      margin: 10px 0;
    }
    
    a {
      color: inherit;
      text-decoration: underline;
    }
    
    pre > [class*="language-"],
    pre,
    code {
      color: #555;
      //font-family: "Inconsolata", "Courier New", monospace !important;
    }
    
    pre {
      font-size: inherit;
      word-break: break-all;
      word-break: break-word;
      white-space: pre-wrap;
    
      > [class*="language-"],
      code {
        font-size: inherit;
        background-color: #f6f8fa;
        padding: 5px;
        display: block;
    
        .line-numbers-rows {
          padding: 5px 0;
        }
      }
    }
    
    code {
      background-color: rgba(27,31,35,0.05);
      font-size: inherit;
    }
    
    blockquote {
      margin: 10px 0;
      background-color: #f3f3f3;
      padding: 10px 10px 10px 3em;
      position: relative;
      
      &:before {
        content: "“";
        font-size: 5em;
        color: #ddd;
        position: absolute;
        line-height: 1;
        top: 6px;
        left: 10px;
        font-family: sans-serif;
      }
    }
    
    table {
      border-collapse: collapse;
      font-size: inherit;
      margin-bottom: 10px;
      display: block;
      width: 100%;
      overflow: auto;
    
      tr:nth-of-type(2n) {
        background-color: #f6f8fa;
      }
    
      th,
      td {
        padding: 4px 13px;
        border: 1px solid #dfe2e5;
    
        ol:last-child,
        ul:last-child {
          margin-bottom: 0;
        }
      }
    }
    
    ol,
    ul {
      padding-left: 2em;
      margin-top: 0;
      margin-bottom: 16px;
    
      ol,
      ul {
        margin-bottom: 0;
      }
    }
    
    ul {
      list-style: square;
    }
    
    ol {
      list-style: decimal;
    }
    
    ul .task-list-item {
      list-style-type: none;
    
      input[type='checkbox'] {
        margin: 0 0.2em 0.25em -1.6em;
        vertical-align: middle;
      }
    }
    
    ol .task-list-item {
      input[type='checkbox'] {
        margin: 0 0.2em 0.25em 0.5em;
        vertical-align: middle;
      }
    }
    
    img {
      max-width: 100%;
    }
    
    em.truncated {
      color: #aaa;
      float: right;
      margin: 20px 0;
    }
    
    .header-link {
        font-size: initial;
        text-decoration: none;
        vertical-align: middle;
        display: none;
    }
    
    [id] {
      &:hover {
        .header-link {
          display: inline;
        }
      }
    }
`;

