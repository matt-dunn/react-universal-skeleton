import React from "react";

import {Field, typedMemo} from "./types";

type FormLabelProps<T> = {
    label: string;
    id: string;
    field: Field<T>;
}

const FormLabel = function<T>({label, id, field}: FormLabelProps<T>) {
    return (
        <label htmlFor={id}>
            {label}
            {field && field.tests.filter(test => test.OPTIONS.name === "required").length > 0 && <span className="isRequired" aria-label="required"> is required</span>}
        </label>
    );
};

const MemoFormLabel = typedMemo(FormLabel);

export {MemoFormLabel as FormLabel};
