import React, {useState, useEffect, ReactElement} from "react";
import styled from "@emotion/styled";
import {css} from "@emotion/core";

import ReactSelect from "react-select";
import {FormStyles} from "components/Form/types";

const SelectStyle = ({isValid, formElementStyles}: {isValid?: boolean; formElementStyles: FormStyles}) => css`
  font-size: inherit;
  background-color: transparent;
  flex-grow: 1;
  > span:first-of-type ~ div:first-of-type {
    ${formElementStyles.controlFocus};
  }
  > div:first-of-type {
    ${formElementStyles.control};
    &, &:hover {
      ${!isValid && formElementStyles.controlInvalid};
    }
  }
`;

const BasicSelect = styled.select<{isValid?: boolean; formElementStyles: FormStyles}>`
  ${props => SelectStyle(props)};
  height: 38px;
  width: 100%;
  ${({formElementStyles}) => formElementStyles.control}
  ${({isValid, formElementStyles}) => !isValid && formElementStyles.controlInvalid}
`;

const Select = styled(ReactSelect)<{isValid?: boolean; formElementStyles: FormStyles}>`
  ${props => SelectStyle(props)};
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

const customStyles = {
    indicatorSeparator: () => ({
        display: "none"
    }),
};

const FancySelect = ({id, disabled, isValid, options, name, value, onChange, onBlur, formStyles, className, ...props}: FancySelectProps): ReactElement<any> => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleChange = ({value}: {value: string}) => onChange(name, value);

    const handleBlur = () => onBlur(name, true);

    const handleSelectChange = () => {};

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
                styles={customStyles}
                {...props}
            />
        );
    } else {
        return (
            <BasicSelect
                id={id}
                className={className}
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
        );
    }
};

export default FancySelect;
