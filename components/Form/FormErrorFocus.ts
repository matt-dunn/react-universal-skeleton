import {useFormikContext} from "formik";
import {RefObject, useEffect} from "react";
import {typedMemo} from "./types";

export type FormErrorFocusProps = {
    formRef: RefObject<HTMLFormElement>;
}
function setFocus(form: HTMLFormElement) {
    // Move into next tick so avoid attempting to focus on a disabled input element
    setTimeout(() => {
        if (!document.activeElement || (document.activeElement as HTMLInputElement).tabIndex < 0) {
            const target = form.querySelector<HTMLInputElement>(".invalid");
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

    useEffect(() => {
        !isValid && formRef.current && setFocus(formRef.current);
    }, [formRef, isValid])

    if (isSubmitting && !isValidating) {
        formRef.current && setFocus(formRef.current);
    }

    return null;
}

const MemoFormErrorFocus = typedMemo(FormErrorFocus);

export {MemoFormErrorFocus as FormErrorFocus};
