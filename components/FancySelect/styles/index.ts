import {FormStyles} from "../../Form";
import {css} from "@emotion/core";

export const SelectStyle = ({isValid, formElementStyles}: {isValid?: boolean; formElementStyles?: FormStyles}) => css`
  font-size: inherit;
  background-color: transparent;
  flex-grow: 1;
  > span:first-of-type ~ div:first-of-type {
    ${formElementStyles && formElementStyles.controlFocus};
  }
  > div:first-of-type {
    ${formElementStyles && formElementStyles.control};
    &, &:hover {
      ${!isValid && formElementStyles && formElementStyles.controlInvalid};
    }
  }
`;
