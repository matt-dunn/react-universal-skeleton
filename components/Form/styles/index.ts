import styled, {css} from "styled-components";
import {FormStyles} from "../types";

export const SubSectionContainer = styled.fieldset`
  margin: 20px 0 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
`;

export const SubSection = styled(SubSectionContainer)`
  margin-top: 0;
`;

export const Legend = styled.legend`
  padding: 2px 20px;
  background-color: #eee;
  border-radius: 1em;
`;

export const Section = styled.section`
  margin: 0 0 10px 0;
`;

export const InputFeedback = styled.label`
  color: red;
  display: block;
  margin: 5px 0 10px 0;
  
  em {
    font-style: normal;
  }
`;

export const formStyles: FormStyles = {
    control: css`
        font-size: inherit;
        border: 1px solid rgb(204, 204, 204);
        border-radius: 4px;
    `,
    controlInvalid: css`
        border-color: red;
    `
};

export const FormContainer = styled.form`
  border: 1px solid #ccc;
  background-color: #fdfdfd;
  border-radius: 4px;
  padding: 10px;
  margin: 20px 0;
  box-sizing: border-box;
  
  button {
    font-size: inherit;
    padding: 5px;
    border: 1px solid #ccc;
    background-color: #eee;
    border-radius: 3px;
    margin: 10px 8px 10px 0;
  }
  
  input {
    padding: 9px 8px;
    ${formStyles.control};
    width: 100%;
  }
  
  textarea {
    padding: 9px 8px;
    ${formStyles.control};
    min-width: 100%;
    min-height: 10em;
  }
  
  input,
  textarea {
      &.invalid {
        border-color: red;
      }
  }
`;

export const Label = styled.label`
  color: #666;
  margin: 2px 0;
  display: block;
`;

export const LabelIsRequired = styled.span`
  color: red;
  text-indent: -900em;
  overflow: hidden;
  display: inline-block;

  &:before {
    float: left;
    content: '*';
    margin-left: 2px;
    text-indent: 0;
  }
`;

