import styled from "@emotion/styled";

export const Container = styled.article`
    font-family: inherit;
    color: #555;
    text-align: left;
    font-weight: normal;
    
    pre > [class*="language-"],
    pre,
    code {
      color: #555;
      font-family: "Courier New", monospace !important;
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
      
      th {
      font-weight: bold;
      }
    
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

