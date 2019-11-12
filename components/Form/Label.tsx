import React, {ReactNode} from "react";

import {Field, typedMemo} from "./types";
import {getFieldMeta} from "./utils";

type FormLabelProps<T> = {
    label: string;
    id: string;
    field: Field<T>;
    children: ReactNode
}

const FormLabel = function<T>({label, id, field, children}: FormLabelProps<T>) {
    const {required} = getFieldMeta(field);

    return (
        <label htmlFor={id}>
            <span>
                {label}
                {required && <span className="isRequired" aria-label="required"> is required</span>}
            </span>
            {children}
        </label>
    );
};

const MemoFormLabel = typedMemo(FormLabel);

export {MemoFormLabel as FormLabel};
