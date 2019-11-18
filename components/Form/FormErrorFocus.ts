import {useFormikContext} from "formik";
import {RefObject, useEffect} from "react";

import {typedMemo} from "./types";
import {useFormContext} from "./utils";

type FormErrorFocusProps = {
    formRef: RefObject<HTMLFormElement>;
}

function setFocus(form: HTMLFormElement, forceFirst = false) {
    // Move into next tick so avoid attempting to focus on a disabled input element
    setTimeout(() => {
        if (!document.activeElement || (document.activeElement as HTMLInputElement).tabIndex < 0) {
            const target = (!forceFirst && form.querySelector<HTMLInputElement>(".invalid")) || (forceFirst && form.querySelector<HTMLInputElement>("input:not([type='hidden']), select, textarea, [tabIndex]"));
            if (target) {
                if (target.tabIndex >= 0) {
                    target.focus();
                } else {
                    const focusable = target.querySelector<HTMLInputElement>("[tabIndex]");
                    focusable && focusable.focus();
                }
            }
        }
    });
}

function FormErrorFocus<T>({formRef}: FormErrorFocusProps) {
    const {isSubmitting, isValidating, isValid} = useFormikContext<T>();
    const {formData} = useFormContext<T, any, any>();

    useEffect(() => {
        (!isValid || formData.error) && formRef.current && setFocus(formRef.current, Boolean(formData.error));
    }, [formRef, isValid, formData.error]);

    if (isSubmitting && !isValidating) {
        formRef.current && setFocus(formRef.current);
    }

    return null;
}

const MemoFormErrorFocus = typedMemo(FormErrorFocus);

export {MemoFormErrorFocus as FormErrorFocus};
