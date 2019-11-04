import React from "react";

import {Field} from "./types";
import {Label, LabelIsRequired} from "./styles";

import useWhatChanged from "components/whatChanged/useWhatChanged";

type FormLabelProps<T> = {
    label: string;
    name: string;
    field: Field<T>;
}

const typedMemo: <T>(c: T) => T = React.memo;

const FormLabel = typedMemo(function<T>({label, name, field}: FormLabelProps<T>) {
    useWhatChanged(FormLabel, { FormLabel, label, field });

    return (
        <Label htmlFor={name as string}>
            {label}
            {field && field.tests.filter(test => test.OPTIONS.name === "required").length > 0 && <LabelIsRequired aria-label="required"> is required</LabelIsRequired>}
        </Label>
    );
});

export default FormLabel;
