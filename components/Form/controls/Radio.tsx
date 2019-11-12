import React from "react";

import {FormStyles, typedMemo} from "../types";
import {Checkbox} from "./Checkbox";

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
                        <label
                            htmlFor={`${id}-${index}`}
                        >
                            {option.label || option.value}
                        </label>
                    </div>
                )
            })}
        </fieldset>
    )
}

const MemoRadio = typedMemo(Radio);

export {MemoRadio as Radio};
