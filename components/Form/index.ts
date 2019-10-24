import React, {useContext} from "react";
import {isEmpty} from "lodash";

export type FormData<T = {}, P = {}> = {
    isProcessed: boolean;
    data: T;
    isSubmitted: boolean;
    payload?: P;
};

export const FormData = <T = {}>(formData: FormData<T>): FormData => {
    const {isProcessed = false, data = {}, isSubmitted = !isEmpty(data), payload} = formData;

    return {
        isProcessed,
        data,
        isSubmitted,
        payload
    }
};

export const FormDataContext = React.createContext<FormData | undefined>(undefined);

export const FormDataProvider = FormDataContext.Provider;

export const useFormData = <T>() => {
    const formData = useContext(FormDataContext);

    return formData as FormData<T>
};
