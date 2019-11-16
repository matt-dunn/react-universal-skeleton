import React from "react";

import {FormStyles, typedMemo} from "../types";
import {Checkbox} from "./Checkbox";
import styled from '@emotion/styled'

type Option = {
    value: string;
    label: string;
}

type RadioProps = {
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

const Label = styled.label`
&& {
    display: flex;
    margin: 8px 0;
    
    > span:first-of-type {
      margin: 0 8px 0 0;
    }
}
`;

function Radio({options, name, value, onChange, onBlur, formStyles, isValid, id, ...props}: RadioProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, value: string | boolean) => onChange(name, value.toString());

    const handleBlur = () => onBlur(name, true);

    return (
        <fieldset
            className="radio"
        >
            {options.map((option, index) => {
                return (
                    <div
                        key={option.value}
                        className="radio-option"
                    >
                        <Label
                            htmlFor={`${id}-${index}`}
                        >
                            <Checkbox
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="radio"
                                name={name}
                                option={option.value}
                                value={option.value === value}
                                {...props}
                                id={`${id}-${index}`}
                                formStyles={formStyles}
                                isValid={isValid}
                            />
                            {option.label || option.value}
                        </Label>
                    </div>
                )
            })}
        </fieldset>
    )
}

const MemoRadio = typedMemo(Radio);

export {MemoRadio as Radio};
