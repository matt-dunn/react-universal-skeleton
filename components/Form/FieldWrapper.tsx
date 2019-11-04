import React, {useMemo} from "react";
import {Field, Fields, FieldSetMap} from "./types";
import FieldsSet from "./FieldSet";

export type FieldWrapperProps<T> = {
    fields: Fields<T>;
    path?: string;
    children?: (map: FieldSetMap<T>) => JSX.Element;
}

function flattenFields<T>(fields: Fields<T>, path: string, fieldPath = ""): FieldSetMap<T> {
    return Object.keys(fields).reduce((map, key) => {
        const field = fields[key];

        if (field._type === "object") {
            const objectFields = flattenFields(field.fields, path, key)
            Object.keys(objectFields).forEach(category => {
                if (!map[category]) {
                    map[category] = [];
                }

                map[category] = map[category].concat(objectFields[category])
            })
        } else {
            const {category = "children"} = field._meta;

            if (!map[category]) {
                map[category] = [];
            }

            map[category].push({
                schema: field,
                fullPath: [path, fieldPath, key].filter(part => part).join(".")
            });
        }

        return map;
    }, {children: []} as FieldSetMap<T>) as FieldSetMap<T>
}

function FieldWrapper<T>({fields, path = "", children}: FieldWrapperProps<T>) {
    const fieldSet = useMemo<FieldSetMap<T>>(() => flattenFields(fields, path), [fields, path]);

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
