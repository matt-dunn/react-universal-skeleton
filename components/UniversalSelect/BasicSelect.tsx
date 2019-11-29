import React, {ReactElement} from "react";
import styled from "@emotion/styled";

import {FormStyles} from "../Form";
import {SelectStyle} from "./styles";

type Option = {
    value: string;
    label: string;
}

type BasicSelectProps = {
    id: string;
    disabled?: boolean;
    isValid?: boolean;
    options: Option[];
    name: string;
    value?: string;
    onChange: (name: string | any, value: string, shouldValidate?: boolean) => void;
    onBlur: (name: string | any, touched?: boolean, shouldValidate?: boolean) => void;
    formStyles: FormStyles;
    className?: string;
}

const Select = styled.select<{isValid?: boolean; formElementStyles?: FormStyles}>`
    background-color: inherit;
    background-image: url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='%23ccc'%3E%3Cpath d='M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z'/%3E%3C/svg%3E%0A");
    background-position: right 8px top 50%, 0 0;
    background-repeat: no-repeat, repeat;
    padding: 2px 34px 2px 10px;
    display: block;
    min-height: 38px;
    color: hsl(0,0%,20%);
    margin: 0;
    appearance: none;
    width: 100%;
    ${props => SelectStyle(props)};
    ${({formElementStyles}) => formElementStyles && formElementStyles.control}
    ${({isValid, formElementStyles}) => !isValid && formElementStyles && formElementStyles.controlInvalid}
    
    &:focus {
      background-image: url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='%23666'%3E%3Cpath d='M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z'/%3E%3C/svg%3E%0A");
    }
`;

const BasicSelect = ({id, disabled, isValid, options, name, value, onChange, onBlur, formStyles, className, ...props}: BasicSelectProps): ReactElement<any> => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.currentTarget.name, e.currentTarget.value);

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => onBlur(e.currentTarget.name, true);

    return (
        <Select
            id={id}
            className={className}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            isValid={isValid}
            formElementStyles={formStyles}
            {...props}
        >
            {options.map((option, index) => (
                <option key={index} value={option.value}>{option.label || option.value}</option>
            ))}
        </Select>
    );
};

export default BasicSelect;
