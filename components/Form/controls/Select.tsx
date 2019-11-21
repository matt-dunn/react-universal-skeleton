import React from "react";

import {typedMemo} from "../types";

type Option = {
    value: string;
    label: string;
}

type SelectProps = {
    id: string;
    disabled?: boolean;
    options: Option[];
    name: string;
    value?: string;
    onChange: (name: string | any, value: string, shouldValidate?: boolean) => void;
    onBlur: (name: string | any, touched?: boolean, shouldValidate?: boolean) => void;
    className?: string;
}

function Select({options, onChange, onBlur, ...props}: SelectProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.currentTarget.name, e.currentTarget.value);

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => onBlur(e.currentTarget.name, true);

    return (
        <select
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
        >
            {options.map(option => {
                return (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label || option.value}
                    </option>
                );
            })}
        </select>
    );
}

const MemoSelect = typedMemo(Select);

export {MemoSelect as Select};
