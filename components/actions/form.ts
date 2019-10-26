import React, {useContext, useState} from "react";
import {isEmpty} from "lodash";
import {errorLike, ErrorLike} from "components/error";
import {Schema} from "yup";
import {APIContext} from "./contexts";

export type Errors<T> = {
    [Key in keyof T]: string;
}

export type FormData<T = any, P = any> = {
    isProcessed: boolean;
    data?: T;
    isSubmitted: boolean;
    payload?: P;
    error?: ErrorLike;
    errors: Errors<T>;
};

export const FormData = <T = any, P = any>(formData: FormData<T, P>): FormData<T, P> => {
    const {isProcessed = false, data, payload, error, errors} = formData || {} as FormData<T, P>;

    return {
        isProcessed,
        data,
        isSubmitted: !isEmpty(data),
        payload,
        error: error && errorLike(error),
        errors
    }
};

export const FormDataContext = React.createContext<FormData | undefined>(undefined);

export const FormDataProvider = FormDataContext.Provider;

export const useFormData = <T = any, P = any>(): FormData<T, P> => {
    const formData = useContext(FormDataContext);

    return formData as FormData<T, P>
};

export const useForm = <T, P = any>(schema: Schema<T>, mapDataToAction: {(data: T): Promise<P>}): [FormData<T, P>, (data: T) => Promise<P>] => {
    const formDataContext = useFormData<T, P>();
    const [formData, setFormData] = useState<FormData<T, P>>(formDataContext);

    const submit = (data: T): Promise<P> => {
        setFormData(formData => ({...formData, error: undefined}));

        if (process.env.NODE_ENV !== "production") {
            console.log("useForm: CALL API", data)
        }

        return mapDataToAction(data)
            .then(payload => {
                formDataContext.payload = payload;

                setFormData(formData => ({...formData, isProcessed: true, error: undefined, payload: payload, data}));

                return payload;
            })
            .catch(reason => {
                formDataContext.error = errorLike(reason);

                setFormData(formData => ({...formData, isProcessed: true, error: formDataContext.error, payload: undefined, data}))

                return reason;
            })
    };

    const context = useContext<Promise<P>[]>(APIContext as any);

    if (context && formDataContext.isSubmitted && !formDataContext.isProcessed) {
        formDataContext.isProcessed = true;

        context.push(schema.validate(formDataContext.data, {abortEarly: false})
            .then(data => submit(data))
            .catch(reason => {
                if (process.env.NODE_ENV !== "production") {
                    console.log("useForm: ERROR", reason)
                }

                if (reason.inner) {
                    formDataContext.errors = reason.inner.reduce((errors: any, error: any) => {
                        errors[error.path] = error.message;
                        return errors;
                    }, {})
                }

                return reason;
            })
        );
    }

    return [formData, submit];
}
