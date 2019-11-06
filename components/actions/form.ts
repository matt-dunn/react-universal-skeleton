import React, {useCallback, useContext, useState} from "react";

import {errorLike, ErrorLike} from "components/error";
import {APIContext} from "./contexts";

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

type Action = {
    type: ActionType;
    value?: string;
}

export interface State<S> {
    formId: string;
    data?: S;

    toString(): string;
}

export type FormData<T = any, P = any, E = any, S = any> = {
    isProcessed: boolean;
    data?: T;
    isSubmitted: boolean;
    payload: P;
    error?: ErrorLike;
    innerFormErrors: E;
    action?: Action;
    state: State<S>;
};

export class FormState<S> implements State<S> {
    public formId: string;
    public data?: S;

    constructor(state: State<S>) {
        this.formId = state.formId;
        this.data = state.data;
    }

    public toString = () => {
        return btoa(JSON.stringify(this));
    }

    public static fromString = (state: string) => {
        return new FormState(JSON.parse(atob(state)));
    }
}

export const FormData = <T extends Record<string, any> = any, P = any, E = any, S = any>(formData?: FormData<T, P, E, S>): FormData<T, P, E, S> => {
    const {isProcessed = false, data, payload, error, action, innerFormErrors, state} = formData || {} as FormData<T, P, E, S>;

    return {
        isProcessed,
        isSubmitted: (action && action.type === "submit") || false,
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

    return FormData({data, action, state} as FormData)
};

const FormDataContext = React.createContext<FormData | undefined>(undefined);

export const FormDataProvider = FormDataContext.Provider;

export const useFormData = <T = any, P = any, E = any, S = any>(formId: string, context?: S): FormData<T, P, E, S> => {
    const formData = useContext(FormDataContext);

    if (formData && formData.state && formData.state.formId === formId) {
        return formData as FormData<T, P, E, S>;
    } else {
        return FormData({state: {formId, data: context}} as FormData<T, P, E, S>);
    }
};

export interface MapDataToAction<T, P, S> {
    (data: T, state: S): Promise<P>;
}

export interface PerformAction<T, S> {
    (schema: S, action: ActionType, data: T, value?: string): T | undefined | null;
}

export const useForm = <T, P = any, E = any, S = any, D = any>(formId: string, schema: any, formValidator: (values: T) => Promise<any>, mapDataToAction: MapDataToAction<T, P, D>, performAction?: PerformAction<T, S>, context?: D): [FormData<T, P | undefined, E, D>, (data: T) => Promise<P>] => {
    const formDataContext = useFormData<T, P, E, D>(formId, context);
    const [formData, setFormData] = useState<FormData<T, P | undefined, E>>(formDataContext);

    const submit = useCallback(async(data: T): Promise<P> => {
        setFormData(formData => FormData({...formData, error: undefined}));

        try {
            const payload= await mapDataToAction(data, formData.state.data);

            formDataContext.payload = payload;

            setFormData(formData => FormData({...formData, isProcessed: true, error: undefined, payload: payload, data}));

            return payload;
        } catch(reason) {
            formDataContext.error = errorLike(reason);

            setFormData(formData => FormData({...formData, isProcessed: true, error: formDataContext.error, payload: undefined, data}));

            return reason;
        }
    }, [formData.state.data, formDataContext.error, formDataContext.payload, mapDataToAction]);

    const apiContext = useContext(APIContext);

    if (apiContext && formDataContext.isSubmitted && !formDataContext.isProcessed) {
        formDataContext.data && apiContext.push(formValidator(formDataContext.data)
            .then(submit)
            .catch(reason => {
                if (reason.inner) {
                    formDataContext.innerFormErrors = reason.inner;
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
