import React, {useState, useEffect} from 'react'
import styled, {css} from "styled-components";
import classnames from "classnames";

import ReactSelect from "react-select";
import {FormStyles} from "components/Form/types";

const SelectStyle = css<{isValid?: boolean; formElementStyles: FormStyles}>`
  font-size: inherit;
  background-color: transparent;
  flex-grow: 1;
  > div:first-child {
    ${({formElementStyles}) => formElementStyles.control}
    &, &:hover {
      ${({isValid, formElementStyles}) => !isValid && formElementStyles.controlInvalid}
    }
  }
`;

const BasicSelect = styled.select<{isValid?: boolean; formElementStyles: FormStyles}>`
  ${SelectStyle};
  height: 38px;
  width: 100%;
  ${({formElementStyles}) => formElementStyles.control}
  ${({isValid, formElementStyles}) => !isValid && formElementStyles.controlInvalid}
`;

const Select = styled(ReactSelect)`
  ${SelectStyle}
`;

type Option = {
    value: string;
    label: string;
}

type FancySelectProps = {
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

const FancySelect = ({id, disabled, isValid, options, name, value, onChange, onBlur, formStyles, className}: FancySelectProps): JSX.Element => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleChange = ({value}: {value: string}) => onChange(name, value);

    const handleBlur = () => onBlur(name, true);

    const handleSelectChange = () => {}

    if (isClient) {
        const defaultValue = (value && options.filter(option => option.value ===value)[0]) || options[0];
        return (
            <Select
                inputId={id}
                className={className}
                name={name}
                value={defaultValue}
                options={options}
                onChange={handleChange}
                onBlur={handleBlur}
                isDisabled={disabled}
                isValid={isValid}
                formElementStyles={formStyles}
            />
        )
    } else {
        return (
            <BasicSelect
                id={id}
                className={classnames("no-js", className)}
                name={name}
                value={value}
                onChange={handleSelectChange}
                disabled={disabled}
                isValid={isValid}
                formElementStyles={formStyles}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </BasicSelect>
        )
    }
};

export default FancySelect;
