import React, {useMemo} from "react";

import {Fields, FieldSetMap} from "./types";
import FieldsSet from "./FieldSet";
import {flattenFields, sortFields} from "./utils";

export type FieldWrapperProps<T> = {
    fields: Fields<T>;
    path?: string;
    children?: (map: FieldSetMap<T>) => JSX.Element;
}

function FieldWrapper<T>({fields, path = "", children}: FieldWrapperProps<T>) {
    const fieldSet = useMemo<FieldSetMap<T>>(() => sortFields(flattenFields(fields, path)), [fields, path]);

    return children ? children(fieldSet) : (
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
