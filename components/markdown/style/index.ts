import styled from "@emotion/styled";

import inconsolata from './fonts/inconsolata-regular.ttf';

export const Container = styled.article`
    @font-face {
      font-family: 'Inconsolata';
      src: url(${inconsolata}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    font-family: inherit;
    line-height: inherit;
    font-size: inherit;
    color: #555;
    text-align: left;
    font-weight: normal;
    //pointer-events: none;
    
    h1, h2, h3, h4, h5, h6 {
      font-family: $headings-font-family;
      font-weight: $headings-font-weight;
      line-height: $headings-line-height;
      color: $headings-color;
    }
    
    h1,
    h2,
    h3 {
      margin-top: $line-height-computed;
      margin-bottom: ($line-height-computed / 2);
    }
    
    h4,
    h5,
    h6 {
      margin-top: ($line-height-computed / 2);
      margin-bottom: ($line-height-computed / 2);
    }
    
    h1 {
      font-size: $font-size-h1;
    }
    h2 {
      font-size: $font-size-h2;
    }
    h3 {
      font-size: $font-size-h3;
    }
    h4 {
      font-size: $font-size-h4;
    }
    h5 {
      font-size: $font-size-h5;
    }
    h6 {
      font-size: $font-size-h6;
    }
    
    p {
      margin: 10px 0;
    }
    
    a {
      color: inherit;
      text-decoration: underline;
    }
    
    pre,
    code {
      color: #555;
      font-family: "Inconsolata", "Courier New", monospace !important;
    }
    
    pre {
      font-size: $font-size-base;
      word-break: break-all;
      word-break: break-word;
      white-space: pre-wrap;
    
      code {
        font-size: $font-size-base;
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
      font-size: $font-size-content;
    }
    
    blockquote {
      margin: 10px 0;
    }
    
    table {
      border-collapse: collapse;
      font-size: $font-size-base;
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
`;

