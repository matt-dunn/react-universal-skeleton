import React, {RefObject, useCallback, useContext, useEffect, useRef, useState} from "react";
import * as Yup from 'yup';
import {FormikErrors, yupToFormErrors} from "formik";
import immutable from "object-path-immutable";
import {sortBy} from "lodash";

import {Fields, FieldSetMap, SchemaWithFields, FormContextType} from "./types";
import {ActionType} from "../actions/form";

export const FormContext = React.createContext<FormContextType<any, any, any> | undefined>(undefined);

export const useFormContext = <T, P, S>(): FormContextType<T, P, S> => {
    return (useContext(FormContext) || {}) as FormContextType<T, P, S>;
};

export const getDefault = (schema: SchemaWithFields<any>, path = "") => {
    const pathSchema = Yup.reach(schema, path);

    return ((pathSchema as any)._type === "array" && (Yup.reach(schema, path) as any)._subType.getDefault()) || (pathSchema as any).getDefault()
};

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
        sortedMap[key] = sortBy(map[key], a => ((a.schema._meta || {}).order || 0))
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

export enum SubmittingPhase {
    "none"= "NONE",
    "submitting" = "SUBMITTING",
    "complete" = "COMPLETE"
}

export function useFormSubmission<T>(schema: SchemaWithFields<T>): [RefObject<HTMLFormElement>, (values: T) => void | object | Promise<FormikErrors<T>>, () => void, string] {
    const [submittingPhase, setSubmittingPhase] = useState<SubmittingPhase>(SubmittingPhase.none);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (submittingPhase === SubmittingPhase.complete) {
            setSubmittingPhase(SubmittingPhase.none);

            // Move into next tick so avoid attempting to focus on a disabled input element
            setTimeout(() => {
                if (formRef.current && (!document.activeElement || (document.activeElement as HTMLInputElement).tabIndex < 0)) {
                    const target = formRef.current.querySelector<HTMLInputElement>(".invalid");
                    if (target) {
                        if (target.tabIndex >= 0) {
                            target.focus();
                        } else {
                            const focusable = target.querySelector<HTMLInputElement>("[tabIndex]");
                            focusable && focusable.focus();
                        }
                    }
                }
            })
        }
    }, [submittingPhase]);

    const validate = useCallback((values: any) => {
        return schema.validate(values, {abortEarly: false})
            .then(() => ({}))
            .catch(err => {
                if (err.name === 'ValidationError') {
                    return(yupToFormErrors(err));
                } else {
                    throw err;
                }
            })
            .finally(() => setSubmittingPhase(phase => (phase === SubmittingPhase.submitting && SubmittingPhase.complete) || phase))
    }, [schema]);

    const setSubmitting = () => setSubmittingPhase(SubmittingPhase.submitting);

    return [formRef, validate, setSubmitting, submittingPhase]
}
