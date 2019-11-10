import React, {useCallback, useContext, useState} from "react";

import {errorLike, ErrorLike} from "components/error";
import {APIContext} from "./contexts";
import {ValidationError} from "yup";

if (!(global as any).atob) {
    (global as any).atob = (str: string) => Buffer.from(str, 'base64').toString('binary');
}

if (!(global as any).btoa) {
    (global as any).btoa = (str: string | Buffer) => {
        let buffer;

        if (str instanceof Buffer) {
            buffer = str;
        } else {
            buffer = Buffer.from(str.toString(), 'binary');
        }

        return buffer.toString('base64');
    }
}

export enum ActionType {
    "@@ADD_ITEM" = "add",
    "@@REMOVE_ITEM" = "remove",
    "@@INSERT_ITEM" = "insert",
    "@@SUBMIT" = "submit"
}

export type Action = {
    type: ActionType;
    value?: string;
}

export interface State<S> {
    formId: string;
    data?: S;

    toString(): string;
}

export type FormDataState<T = any, P = any, S = any> = {
    isProcessed: boolean;
    isSubmitted: boolean;
    isComplete: boolean;
    data?: T;
    payload?: P;
    error?: ErrorLike;
    innerFormErrors?: ValidationError[];
    action?: Action;
    state: State<S>;
};

export class FormState<S> implements State<S> {
    public formId: string;
    public data?: S;

    constructor(state?: State<S>) {
        this.formId = (state && state.formId) || "";
        this.data = state && state.data;
    }

    public toString = () => {
        return btoa(JSON.stringify(this));
    }

    public static fromString = (state: string) => {
        return new FormState(JSON.parse(atob(state)));
    }
}

export const FormDataState = <T extends Record<string, any> = any, P = any, S = any>(formData?: FormDataState<T, P, S>): FormDataState<T, P, S> => {
    const {isProcessed = false, isComplete = false, data, payload, error, action, innerFormErrors = [], state} = formData || {} as FormDataState<T, P, S>;

    return {
        isProcessed,
        isSubmitted: (action && action.type === "submit") || false,
        isComplete,
        data,
        innerFormErrors,
        payload,
        action,
        error: error && errorLike(error),
        state: new FormState(state)
    }
};

export const parseFormData = (payload: any) => {
    const {data, action, state} = payload && Object.keys(payload).reduce((o, key) => {
        if (key === "@@FORMSTATE") {
            o.state = FormState.fromString(payload[key])
        } else if (key === "@@ADD_ITEM" || key === "@@REMOVE_ITEM" || key === "@@INSERT_ITEM" || key === "@@SUBMIT") {
            o.action = {
                type: ActionType[key],
                value: payload[key]
            }
        } else {
            o.data[key] = payload[key];
        }
        return o;
    }, {data: {}, action: undefined, state: undefined} as { data: {[key: string]: string}; action?: Action; state?: State<any> });

    return FormDataState({data, action, state} as FormDataState)
};

const FormDataContext = React.createContext<FormDataState | undefined>(undefined);

export const FormDataProvider = FormDataContext.Provider;

export const useCurrentFormData = <T = any, P = any, S = any>(formId: string, context?: S): FormDataState<T, P, S> => {
    const formData = useContext(FormDataContext);

    if (formData && formData.state && formData.state.formId === formId) {
        return formData as FormDataState<T, P, S>;
    } else {
        return FormDataState({state: {formId, data: context}} as FormDataState<T, P, S>);
    }
};

export interface MapDataToAction<T, P, S> {
    (data: T, state: S): Promise<P>;
}

export interface PerformAction<T, S> {
    (schema: S, action: ActionType, data: T, value?: string): T | undefined | null;
}

export const useForm = <T, P = any, S = any, D = any>(formId: string, schema: any, formValidator: (values: T) => Promise<any>, mapDataToAction: MapDataToAction<T, P, D>, performAction?: PerformAction<T, S>, context?: D): [FormDataState<T, P | undefined, D>, (data: T) => Promise<P>] => {
    const formDataContext = useCurrentFormData<T, P, D>(formId, context);
    const [formData, setFormData] = useState<FormDataState<T, P | undefined>>(formDataContext);

    const submit = useCallback(async(data: T): Promise<P> => {
        setFormData(formData => FormDataState({...formData, error: undefined, innerFormErrors: undefined}));

        try {
            const payload = await mapDataToAction(data, formData.state.data);

            formDataContext.payload = payload;
            formDataContext.isComplete = true;

            setFormData(formData => FormDataState({...formData, isProcessed: true, isComplete: true, error: undefined, payload: payload, data}));

            return payload;
        } catch(reason) {
            if (reason.name === "ValidationError") {
                formDataContext.innerFormErrors = [reason].concat(reason.inner);
            } else {
                formDataContext.error = errorLike(reason);
            }

            setFormData(formData => FormDataState({...formData, isProcessed: true, innerFormErrors: formDataContext.innerFormErrors, error: formDataContext.error, payload: undefined, data}));

            return reason;
        }
    }, [formData.state.data, formDataContext.error, formDataContext.innerFormErrors, formDataContext.isComplete, formDataContext.payload, mapDataToAction]);

    const apiContext = useContext(APIContext);

    if (apiContext && formDataContext.isSubmitted && !formDataContext.isProcessed) {
        formDataContext.data && apiContext.push(formValidator(formDataContext.data)
            .then(submit)
            .catch(reason => {
                if (reason.name === "ValidationError") {
                    formDataContext.innerFormErrors = [reason].concat(reason.inner);
                } else {
                    formDataContext.error = reason;
                }

                return reason;
            })
        );
    }

    if (formData.action && performAction && !formDataContext.isProcessed && formDataContext.data) {
        const data = performAction(schema, formData.action.type, formDataContext.data, formData.action.value);
        if (data) {
            formDataContext.data = data;
        }
    }

    formDataContext.isProcessed = true;

    return [formData, submit];
};
