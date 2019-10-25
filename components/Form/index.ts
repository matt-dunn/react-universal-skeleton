import React, {useContext} from "react";
import {isEmpty} from "lodash";
import {errorLike, ErrorLike} from "components/error";

export type Errors<T> = {
    [Key in keyof T]: string;
}

export type FormData<T = {}, P = any> = {
    isProcessed: boolean;
    data: T;
    isSubmitted: boolean;
    payload?: P;
    error?: ErrorLike;
    errors: Errors<T>;
};

export const FormData = <T = {}, P = any>(formData: FormData<T, P>): FormData<T, P> => {
    const {isProcessed = false, data = {} as T, payload, error, errors} = formData || {} as FormData<T, P>;

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

export const useFormData = <T = {}, P = any>(): FormData<T, P> => {
    const formData = useContext(FormDataContext);

    return formData as FormData<T, P>
};
