import React from "react";

import {FormStyles, typedMemo} from "../types";

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

function Checkbox({options, name, value, onChange, onBlur, formStyles, isValid, ...props}: CheckboxProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(name, e.currentTarget.checked);

    const handleBlur = () => onBlur(name, true);

    return (
        <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
        />
    )
}

const MemoCheckbox = typedMemo(Checkbox);

export {MemoCheckbox as Checkbox};
