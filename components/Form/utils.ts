import React, {ComponentType, useContext} from "react";
import * as Yup from "yup";
import {Schema} from "yup";
import {wrap} from "object-path-immutable";
import {sortBy, isFunction} from "lodash";

import {Field, FieldMeta, Fields, FieldSetMap, FormComponent, FormContextType} from "./types";
import {ActionType} from "../actions/form";
import Select from "components/UniversalSelect/BasicSelect";
import {Checkbox} from "./controls/Checkbox";
import {Radio} from "./controls/Radio";
import {FormikErrors, FormikValues} from "formik";

export const FormContext = React.createContext<FormContextType<any, any, any> | undefined>(undefined);

export const useFormContext = <T, P, S>(): FormContextType<T, P, S> => {
    return (useContext(FormContext) || {}) as FormContextType<T, P, S>;
};

export type FieldInferredMeta = {
    min: number;
    max: number | undefined;
    required: boolean;
}

export function getFieldMeta<T>(schema: Field<T>): FieldInferredMeta {
    const defaultMeta = {min: 0, max: undefined, required: false} as FieldInferredMeta;

    return schema && schema.tests.reduce((o: FieldInferredMeta, test: { OPTIONS: {name: string; params: any }}) => {
        if (test.OPTIONS.name === "min") {
            o.min = parseInt(test.OPTIONS.params.min, 10);
        } else if (test.OPTIONS.name === "max") {
            o.max = parseInt(test.OPTIONS.params.max, 10);
        } else if (test.OPTIONS.name === "required") {
            o.required = true;
        }
        return o;
    }, defaultMeta) || defaultMeta;
}

function iterateSchema<T>(schema: Field<T>, path = ""): any {
    if (schema._type === "array") {
        const {min, max} = getFieldMeta(schema);

        if (min > 0) {
            const item = iterateSchema(schema._subType);
            return Array.from(Array(Math.min(min, max || 0)).keys()).map(() => ({...item}));
        }

        return schema.getDefault();
    } else if (schema._type === "object") {
        const fields = schema.fields;

        return Object.keys(fields).reduce((o, key) => {
            o[key] = iterateSchema(fields[key], [path, key].filter(part => part).join("."));
            return o;
        }, {} as {[key: string]: any});
    } else {
        const defaultValue = schema.getDefault();
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        return schema._type === "boolean" ? false : "";
    }
}

export function getDefault<T>(schema: Field<T>, path = "") {
    return iterateSchema(Yup.reach(schema, path) as Field<T>);
}

export function flattenFields<T>(fields: Fields<T>, path: string, fieldPath = ""): FieldSetMap<T> {
    return Object.keys(fields).reduce((map, key) => {
        const field = fields[key];

        if (field._type === "object") {
            const objectFields = flattenFields(field.fields, path, key);

            Object.keys(objectFields).forEach(category => {
                if (!map[category]) {
                    map[category] = [];
                }

                map[category] = map[category].concat(objectFields[category]);
            });
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
    }, {children: []} as FieldSetMap<T>) as FieldSetMap<T>;
}

export function sortFields<T>(map: FieldSetMap<T>): FieldSetMap<T> {
    return Object.keys(map).reduce((sortedMap, key) => {
        sortedMap[key] = sortBy(map[key], a => ((a.schema._meta || {}).order || 0));
        return sortedMap;
    }, {} as FieldSetMap<T>);
}

export function performAction<T>(schema: Schema<any>, action: ActionType, data: T, value?: string): T | undefined | null {
    switch (action) {
        case "add": {
            return (value && wrap(data).push(value, getDefault(schema as Field, value)).value()) || data;
        }
        case "remove": {
            return wrap(data).del(value).value();
        }
        case "insert": {
            if (value) {
                const parts = value.split(".");
                const index = parseInt(parts.slice(-1).join("."), 10);
                const path = parts.slice(0, -1).join(".");
                return wrap(data).insert(path, getDefault(schema as Field, value), index).value();
            }
            break;
        }
    }
}

function isComponent(arg: any): arg is ComponentType {
    return isFunction(arg) || (arg && arg.$$typeof);
}

export const getTypeProps = (schema: Field, additionalProps: any = {}): {Component: FormComponent; props: any} => {
    const {_type: type, _meta: {Component, props = {}} = {} as FieldMeta} = schema;

    if (isComponent(Component)) {
        return {
            Component,
            props: {
                ...props,
                ...additionalProps
            }
        };
    }

    const {min, max} = getFieldMeta(schema);

    if (Component === "select" || (!Component && props.options)) {
        return {
            Component: Select,
            props: {
                ...props,
                ...additionalProps
            }
        };
    } else if (Component === "radio") {
        return {
            Component: Radio,
            props: {
                ...props,
                ...additionalProps
            }
        };
    } else if (Component === "autoselect") {
        return {
            Component: (props.options && props.options.length > 4 && Select) || Radio,
            props: {
                ...props,
                ...additionalProps
            }
        };
    } else if (type === "number") {
        const typeProps: React.InputHTMLAttributes<HTMLInputElement> = {
            type: "number",
            min,
            max,
            ...props
        };
        return {
            Component: "input",
            props: typeProps
        };
    } else if (type === "boolean") {
        return {
            Component: Checkbox,
            props: {
                ...props,
                ...additionalProps
            }
        };
    }

    const typeProps: React.InputHTMLAttributes<HTMLInputElement> = {
        type: "text",
        maxLength: max,
        ...props
    };
    return {
        Component: Component || "input",
        props: typeProps
    };
};

export const buildId = (formId: string, fullPath: string) => `${formId}-${fullPath}`;

type FormErrors = {
    id: string;
    message: string;
}

import {isObject} from "lodash";

export const convertErrors = <T>(formId: string, errors: FormikErrors<T> & FormikValues) => {
    const parse = (errors: FormikErrors<T> & FormikValues, path = "") => {
        return Object.keys(errors).reduce((e, key) => {
            if (key !== "undefined") {
                const error = errors[key];
                const fullPath = [path, key].filter(p => p).join(".");

                if (isObject(error)) {
                    e = e.concat(parse(error, fullPath));
                } else {
                    e.push({
                        id: buildId(formId, fullPath),
                        message: error
                    });
                }
            }

            return e;
        }, [] as FormErrors[]);
    };

    return parse(errors);
};
