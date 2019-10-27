import React, {useState, useEffect} from 'react'
import styled, {css} from "styled-components";

import ReactSelect from "react-select";

const SelectStyle = css`
  font-size: inherit;
  height: 36px;
  background-color: transparent;
  flex-grow: 1;
  border-color: rgb(204, 204, 204);
`;

const BasicSelect = styled.select`
  ${SelectStyle}
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
    options: Option[];
    name: string;
    value?: string;
    onChange: (name: string | any, value: string, shouldValidate?: boolean) => void;
    onBlur: (name: string | any, touched?: boolean, shouldValidate?: boolean) => void;
}

const FancySelect = ({id, disabled, options, name, value, onChange, onBlur}: FancySelectProps): JSX.Element => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleChange = ({value}: {value: string}) => {
        // this is going to call setFieldValue and manually update values.topcis
        onChange(name, value);
    };

    const handleBlur = () => {
        onBlur(name, true);
    };

    const handleSelectChange = () => {

    }

    if (isClient) {
        const defaultValue = (value && options.filter(option => option.value ===value)[0]) || options[0];
        return (
            <Select
                id={id}
                name={name}
                value={defaultValue}
                options={options}
                onChange={handleChange}
                onBlur={handleBlur}
                isDisabled={disabled}
            />
        )
    } else {
        return (
            <BasicSelect
                id={id}
                className="no-js"
                name={name}
                value={value}
                onChange={handleSelectChange}
                disabled={disabled}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </BasicSelect>
        )
    }
};

export default FancySelect;
