import styled from "@emotion/styled";
import {css} from "@emotion/core";

import {FormStyles} from "../types";

export const formStyles: FormStyles = {
    control: css`
        font-size: inherit;
        font-family: inherit;
        border: 1px solid rgb(204, 204, 204);
        border-radius: 4px;
    `,
    controlInvalid: css`
        border-color: var(--invalid-color);
    `,
    controlFocus: css`
      outline: none;
      border-color: #4086f7 !important;
      box-shadow: 0 0 0 1px #4086f7 !important;
    `
};

export const FormContainer = styled.form`
  --invalid-color: #e20020;

  border: 1px solid #ccc;
  background-color: #fdfdfd;
  border-radius: 4px;
  padding: 10px;
  margin: 0;
  box-sizing: border-box;
  
  section {
    margin: 0 0 10px 0;
  }
  
  button {
    font-size: inherit;
    padding: .375rem .75rem;
    border: 1px solid #ccc;
    background-color: #eee;
    border-radius: .25rem;
    
    &.primary {
      background-color: #007bff;
      border-color: #007bff;
      color: #fff;
    }
    
    &[disabled] {
      opacity: 0.5;
    }
  }
  
  textarea,
  input[type] {
    padding: 9px 8px;
    ${formStyles.control};
  }
   
  input {
    &:not([type='radio']),
    &:not([type='checkbox']) {
      width: 100%;
    }
  }
  
  textarea {
    min-width: 100%;
    max-width: 100%;
    min-height: 10em;
  }
  
  label {
      > select,
      > input,
      > textarea {
        &:focus {
            ${formStyles.controlFocus};
        }
    
        &.invalid {
          border-color: var(--invalid-color);
        }
    }
  }
  
  [data-type='boolean'] {
    label:first-of-type {
      display: flex;
        > span:first-of-type {
          display: inline-block;
          margin: 0 14px 0 0;
        }
    }
  }

  select {
    background-color: inherit;
    background-image: url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='%23ccc'%3E%3Cpath d='M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z'/%3E%3C/svg%3E%0A");
    background-position: right 8px top 50%, 0 0;
    background-repeat: no-repeat, repeat;
    padding: 2px 34px 2px 10px;
    display: block;
    min-height: 38px;
    color: hsl(0,0%,20%);
    margin: 0;
    ${formStyles.control};
    appearance: none;
    
    &:focus {
      background-image: url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='%23666'%3E%3Cpath d='M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z'/%3E%3C/svg%3E%0A");
    }
    
    &:before {
      content: "";
      border-left: 1px solid rgb(204, 204, 204);
    }
  }
  
  fieldset {
    margin: 20px 0 10px 0;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
    
    &.subSection {
      margin-top: 0;
  
      > legend {
        font-size: 85%;
        opacity: 0.75;
        text-align: right;
      }
    }
    
    legend {
      padding: 2px 20px;
      background-color: #eee;
      border-radius: 1em;
    }
    
    &.radio {
      border: none;
      margin: 0 0 0 10px;
      padding: 0;
    }
  }
  
  label {
    color: #666;
    margin: 2px 0;
    display: block;
    
    > span:first-of-type {
      display: block;
      margin-bottom: 5px;
    }
    
    span.isRequired {
      color: var(--invalid-color);
      text-indent: -900em;
      overflow: hidden;
      display: inline-block;
      line-height: 1;
      position: absolute;
    
      &:before {
        float: left;
        content: '*';
        margin-left: 2px;
        text-indent: 0;
      }
    }
  }
  
  label.feedback {
    color: var(--invalid-color);
    display: block;
    margin: 5px 0 15px 0;
    
    em {
      font-style: normal;
    }
  }
  
  aside.options {
    margin: 10px 0 0 0;
    text-align: right;
    
    &.left {
      text-align: left;
    }
    
    button {
      margin-right: 10px;
    }
    
    *:last-child {
      margin-right: 0;
    }
    
    &.main {
      border-top: 1px solid #eee;
      padding: 10px 0 0 0;
      font-size: 110%;
    }
  }
`;
