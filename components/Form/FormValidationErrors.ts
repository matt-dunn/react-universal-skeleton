import {FormikErrors, useFormikContext} from "formik";
import {useEffect} from "react";

import {typedMemo} from "./types";

type FormValidationErrorsProps<T> = {
    errors: FormikErrors<T>;
}

function FormValidationErrors<T>({errors}: FormValidationErrorsProps<T>) {
    const {setErrors} = useFormikContext<T>();

    useEffect(() => {
        setErrors(errors);
    }, [setErrors, errors]);

    return null;
}

const MemoFormValidationErrors = typedMemo(FormValidationErrors);

export {MemoFormValidationErrors as FormValidationErrors};
