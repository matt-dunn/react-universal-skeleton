import React from "react";

import {FormStyles, typedMemo} from "../types";
import styled from "styled-components";

type Option = {
    value: string;
    label: string;
}

type CheckboxProps = {
    id: string;
    disabled?: boolean;
    isValid?: boolean;
    options: Option[];
    name: string;
    value?: string;
    onChange: (name: string | any, value: boolean, shouldValidate?: boolean) => void;
    onBlur: (name: string | any, touched?: boolean, shouldValidate?: boolean) => void;
    formStyles: FormStyles;
    className?: string;
}

const Container = styled.span<{isValid?: boolean; formStyles: FormStyles}>`
  position: relative;

  input {
      position: absolute;
      opacity: 0;
      cursor: pointer;

      &:checked ~ .checkbox-custom {
        transform: rotate(0deg) scale(1);
        opacity:1;
            
        &::after {
          transform: rotate(45deg) scale(1);
          opacity:1;
          left: 8px;
          top: 3px;
          width: 6px;
          height: 12px;
          border: solid #555;
          border-width: 0 2px 2px 0;
          background-color: transparent;
          border-radius: 0;
        }
      }

    &:focus ~ .checkbox-custom {
      ${({formStyles}) => formStyles.controlFocus};
    }
  }
  
  .checkbox-custom {
    position: absolute;
    top: -2px;
    left: 0;
    height: 24px;
    width: 24px;
    background-color: transparent;
    //transition: all 50ms ease-out;

    ${({formStyles}) => formStyles.control};
    border-radius: 50%;
    ${({isValid, formStyles}) => !isValid && formStyles.controlInvalid};
    
    &::after {
        position: absolute;
        content: "";
        left: 12px;
        top: 12px;
        height: 0;
        width: 0;
        //transition: all 50ms ease-out;
    }
  }
`;

function Checkbox({options, name, value, onChange, onBlur, formStyles, isValid, ...props}: CheckboxProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(name, e.currentTarget.checked);

    const handleBlur = () => onBlur(name, true);

    return (
        <Container formStyles={formStyles} isValid={isValid}>
            <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={handleChange}
                onBlur={handleBlur}
                {...props}
            />
            <span className="checkbox-custom"/>
        </Container>
    )
}

const MemoCheckbox = typedMemo(Checkbox);

export {MemoCheckbox as Checkbox};
