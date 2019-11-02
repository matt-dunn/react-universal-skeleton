import React, {useCallback, useContext, useState} from "react";

import {errorLike, ErrorLike} from "components/error";
import {APIContext} from "./contexts";

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

export type FormData<T = any, P = any, E = any> = {
    isProcessed: boolean;
    data?: T;
    isSubmitted: boolean;
    payload: P;
    error?: ErrorLike;
    innerFormErrors: E;
    action?: Action;
};

export const FormData = <T extends Record<string, any> = any, P = any, E = any>(formData: FormData<T, P, E>): FormData<T, P, E> => {
    const {isProcessed = false, data, payload, error, innerFormErrors} = formData || {} as FormData<T, P, E>;

    return {
        isProcessed,
        isSubmitted: (data && data.hasOwnProperty("@@SUBMIT")) || false,
        data,
        innerFormErrors,
        payload,
        error: error && errorLike(error)
    }
};

const FormDataContext = React.createContext<FormData | undefined>(undefined);

export const FormDataProvider = FormDataContext.Provider;

export const useFormData = <T = any, P = any, E = any>(): FormData<T, P, E> => {
    const formData = useContext(FormDataContext);

    if (formData && formData.data) {
        formData.data = Object.keys(formData.data).reduce((data, key) => {
            if (key === "@@ADD_ITEM" || key === "@@REMOVE_ITEM" || key === "@@INSERT_ITEM" || key === "@@SUBMIT") {
                formData.action = {
                    type: ActionType[key],
                    value: formData.data[key]
                }
            } else {
                data[key] = formData.data[key];
            }
            return data;
        }, {} as {[key: string]: string})
    }

    return formData as FormData<T, P, E>;
};

export interface MapDataToAction<T, P> {
    (data: T): Promise<P>;
}

export const useForm = <T, P = any | undefined, E = any | undefined>(formValidator: (values: T) => Promise<any>, mapDataToAction: MapDataToAction<T, P>, performAction?: (action: ActionType, data: T, value?: string) => T | undefined | null): [FormData<T, P | undefined, E>, (data: T) => Promise<P>] => {
    const formDataContext = useFormData<T, P, E>();
    const [formData, setFormData] = useState<FormData<T, P | undefined, E>>(formDataContext);

    const submit = useCallback(async(data: T): Promise<P> => {
        setFormData(formData => FormData({...formData, error: undefined}));

        try {
            const payload= await mapDataToAction(data);

            formDataContext.payload = payload;

            setFormData(formData => FormData({...formData, isProcessed: true, error: undefined, payload: payload, data}));

            return payload;
        } catch(reason) {
            formDataContext.error = errorLike(reason);

            setFormData(formData => FormData({...formData, isProcessed: true, error: formDataContext.error, payload: undefined, data}));

            return reason;
        }
    }, [formDataContext.error, formDataContext.payload, mapDataToAction]);

    const context = useContext(APIContext);

    if (context && formDataContext.isSubmitted && !formDataContext.isProcessed) {
        formDataContext.data && context.push(formValidator(formDataContext.data)
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
        const data = performAction(formData.action.type, formDataContext.data, formData.action.value);
        if (data) {
            formDataContext.data = data;
        }
    }

    formDataContext.isProcessed = true;

    return [formData, submit];
};
