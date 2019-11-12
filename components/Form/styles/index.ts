import styled, {css} from "styled-components";

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
      box-shadow: 0 0 0 1px #4086f7;
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
  
  input {
    padding: 9px 8px;
    ${formStyles.control};
    
    &:not([type='radio']),
    &:not([type='checkbox']) {
      width: 100%;
    }
  }
  
  textarea {
    padding: 9px 8px;
    ${formStyles.control};
    min-width: 100%;
    max-width: 100%;
    min-height: 10em;
  }
  
  select,
  input,
  textarea {
    &:focus {
        ${formStyles.controlFocus};
    }

    &.invalid {
      border-color: var(--invalid-color);
    }
  }
  
  [data-type='boolean'] {
    label:first-child {
      display: flex;
        > span:first-child {
          display: inline-block;
          margin: 0 14px 0 0;
        }
    }
  }

  select {
    background-color: inherit;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23777%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat, repeat;
    background-position: right .7em top 50%, 0 0;
    background-size: .65em auto, 100%;
    padding: 9px 2em 9px 8px;
    margin: 0;
    ${formStyles.control};
    appearance: none;
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
    
    > span:first-child {
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
    margin: 5px 0 10px 0;
    
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
