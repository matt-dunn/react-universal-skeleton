import React, {useMemo} from "react";
import {sortBy} from "lodash"

import {Fields, FieldSetMap} from "./types";
import FieldsSet from "./FieldSet";
import {flattenFields} from "./utils";

export type FieldWrapperProps<T> = {
    fields: Fields<T>;
    path?: string;
    children?: (map: FieldSetMap<T>) => JSX.Element;
}

function sortFields<T>(map: FieldSetMap<T>): FieldSetMap<T> {
    return Object.keys(map).reduce((sortedMap, key) => {
        sortedMap[key] = sortBy(map[key], a => ((a.schema._meta || {}).order || 0))
        return sortedMap;
    }, {} as FieldSetMap<T>);
}

function FieldWrapper<T>({fields, path = "", children}: FieldWrapperProps<T>) {
    const fieldSet = useMemo<FieldSetMap<T>>(() => sortFields(flattenFields(fields, path)), [fields, path]);

    return (children && children(fieldSet)) || (
        <>
            {Object.keys(fieldSet).map(key => {
                return (
                    <FieldsSet
                        key={key}
                        fields={fieldSet[key]}
                    />
                )
            })}
        </>
    );
}

export default FieldWrapper;
