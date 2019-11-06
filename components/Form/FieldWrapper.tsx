import React, {useMemo} from "react";

import {Fields, FieldSetMap} from "./types";
import FieldsSet from "./FieldSet";
import {flattenFields, sortFields, useFormContext} from "./utils";
import {FormDataState} from "../actions/form";
import {ValidationError} from "yup";

export type FieldWrapperProps<T, P, S> = {
    fields: Fields<T>;
    path?: string;
    children?: (map: FieldSetMap<T>, formData: FormDataState<T, P, ValidationError[], S>) => JSX.Element;
}

function FieldWrapper<T, P, S>({fields, path = "", children}: FieldWrapperProps<T, P, S>) {
    const {formData} = useFormContext<T, P, S>();
    const fieldSet = useMemo<FieldSetMap<T>>(() => sortFields(flattenFields(fields, path)), [fields, path]);

    return children ? children(fieldSet, formData) : (
        <>
            {Object.keys(fieldSet).map(key => (
                <FieldsSet
                    key={key}
                    fields={fieldSet[key]}
                />
            ))}
        </>
    );
}

export default FieldWrapper;
