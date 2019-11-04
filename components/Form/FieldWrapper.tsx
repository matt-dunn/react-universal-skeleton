import React, {useMemo} from "react";
import {Fields} from "./types";
import FieldsSet from "./FieldSet";

type FieldWrapperProps<T> = {
    fields: Fields<T>;
    path?: string;
    children?: (map: any) => JSX.Element;
}
const flattenFields = (fields, path, fieldPath = "") => {
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
    }, {children: []})
}

function FieldWrapper<T>({fields, path = "", children}: FieldWrapperProps<T>) {
    const fieldSet = useMemo(() => flattenFields(fields, path), [fields, path]);

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
