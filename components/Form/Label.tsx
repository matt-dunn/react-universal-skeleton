import React from "react";

import {Field, typedMemo} from "./types";
import {getFieldMeta} from "./utils";

type FormLabelProps<T> = {
    label: string;
    id: string;
    field: Field<T>;
}

const FormLabel = function<T>({label, id, field}: FormLabelProps<T>) {
    const {required} = getFieldMeta(field);

    return (
        <label htmlFor={id}>
            {label}
            {required && <span className="isRequired" aria-label="required"> is required</span>}
        </label>
    );
};

const MemoFormLabel = typedMemo(FormLabel);

export {MemoFormLabel as FormLabel};
