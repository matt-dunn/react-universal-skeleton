import React from "react";

import {Field, typedMemo} from "./types";
import {Label, LabelIsRequired} from "./styles";

type FormLabelProps<T> = {
    label: string;
    id: string;
    field: Field<T>;
}

const FormLabel = function<T>({label, id, field}: FormLabelProps<T>) {
    return (
        <Label htmlFor={id}>
            {label}
            {field && field.tests.filter(test => test.OPTIONS.name === "required").length > 0 && <LabelIsRequired aria-label="required"> is required</LabelIsRequired>}
        </Label>
    );
};

const MemoFormLabel = typedMemo(FormLabel);

export {MemoFormLabel as FormLabel};
