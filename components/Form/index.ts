import React, {useContext} from "react";
import {isEmpty} from "lodash";
import {errorLike, ErrorLike} from "components/error";

export type FormData<T = {}, P = {}> = {
    isProcessed: boolean;
    data: T;
    isSubmitted: boolean;
    payload?: P;
    error?: ErrorLike;
};

export const FormData = <T = {}>(formData: FormData<T>): FormData => {
    const {isProcessed = false, data = {}, isSubmitted = !isEmpty(data), payload, error} = formData;

    return {
        isProcessed,
        data,
        isSubmitted,
        payload,
        error: error && errorLike(error)
    }
};

export const FormDataContext = React.createContext<FormData | undefined>(undefined);

export const FormDataProvider = FormDataContext.Provider;

export const useFormData = <T, P = any>() => {
    const formData = useContext(FormDataContext);

    return formData as FormData<T, P>
};
