import React from "react";

import {Field, typedMemo} from "./types";
import {Label, LabelIsRequired} from "./styles";

type FormLabelProps<T> = {
    label: string;
    name: string;
    field: Field<T>;
}

const FormLabel = function<T>({label, name, field}: FormLabelProps<T>) {
    return (
        <Label htmlFor={name as string}>
            {label}
            {field && field.tests.filter(test => test.OPTIONS.name === "required").length > 0 && <LabelIsRequired aria-label="required"> is required</LabelIsRequired>}
        </Label>
    );
};

export default typedMemo(FormLabel);
