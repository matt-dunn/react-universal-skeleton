import React, {useContext} from "react";
import * as Yup from 'yup';
import immutable from "object-path-immutable";
import {sortBy} from "lodash";

import {Field, Fields, FieldSetMap, FormContextType} from "./types";
import {ActionType} from "../actions/form";

export const FormContext = React.createContext<FormContextType<any, any, any> | undefined>(undefined);

export const useFormContext = <T, P, S>(): FormContextType<T, P, S> => {
    return (useContext(FormContext) || {}) as FormContextType<T, P, S>;
};

export type ArrayMeta = {
    min: number;
    max: number | undefined;
}

export function getArrayMeta<T>(schema: Field<T>): ArrayMeta {
    const defaultMeta = {min: 0, max: undefined} as ArrayMeta;

    return schema && schema._type === "array" && schema.tests.reduce((o: ArrayMeta, test: { OPTIONS: {name: string; params: any }}) => {
        if (test.OPTIONS.name === "min") {
            o.min = parseInt(test.OPTIONS.params.min, 10);
        } else if (test.OPTIONS.name === "max") {
            o.max = parseInt(test.OPTIONS.params.max, 10);
        }
        return o;
    }, defaultMeta) || defaultMeta;
}

function iterateSchema<T>(schema: Field<T>, path = ""): any {
    if (schema._type === "array") {
        const {min, max} = getArrayMeta(schema);

        if (min > 0) {
            const item = iterateSchema(schema._subType);
            return Array.from(Array(Math.min(min, max || 0)).keys()).map(() => ({...item}))
        }

        return schema.getDefault()
    } else if (schema._type === "object") {
        const fields = schema.fields;

        return Object.keys(fields).reduce((o, key) => {
            o[key] = iterateSchema(fields[key], [path, key].filter(part => part).join("."))
            return o;
        }, {} as {[key: string]: any})
    } else {
        return schema.getDefault() || "";
    }
}

export function getDefault<T>(schema: Field<T>, path = "") {
    return iterateSchema(Yup.reach(schema, path) as Field<T>);
}

export function flattenFields<T>(fields: Fields<T>, path: string, fieldPath = ""): FieldSetMap<T> {
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
            const {category = "children"} = field._meta || {};

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

export function sortFields<T>(map: FieldSetMap<T>): FieldSetMap<T> {
    return Object.keys(map).reduce((sortedMap, key) => {
        sortedMap[key] = sortBy(map[key], a => ((a.schema._meta || {}).order || 0));
        return sortedMap;
    }, {} as FieldSetMap<T>);
}

export function performAction<T>(schema: any, action: ActionType, data: T, value?: string): T | undefined | null {
    switch (action) {
        case "add": {
            return (value && immutable.push(data, value, getDefault(schema, value))) || data;
        }
        case "remove": {
            return immutable.del(data, value)
        }
        case "insert": {
            if (value) {
                const parts = value.split(".");
                const index = parseInt(parts.slice(-1).join("."), 10);
                const path = parts.slice(0, -1).join(".");
                return immutable.insert(data, path, getDefault(schema, value), index)
            }
            break;
        }
    }
}
