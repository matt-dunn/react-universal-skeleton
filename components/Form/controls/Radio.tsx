import React from "react";

import {FormStyles, typedMemo} from "../types";

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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(name, e.currentTarget.value);

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
                        <input
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="radio"
                            name={name}
                            value={option.value}
                            {...props}
                            id={`${id}-${index}`}
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
