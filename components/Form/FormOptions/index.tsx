import React from "react";
import {useFormikContext} from "formik";
import {ButtonGroup, ButtonPrimary, ButtonSimple} from "components/Buttons";

import {typedMemo} from "./types";

type FormOptionsProps = {
    i18n?: {
        reset: string;
        submit: string;
    };
}

function FormOptions<T>({i18n}: FormOptionsProps) {
    const {handleReset, dirty, isSubmitting, isValid, isInitialValid} = useFormikContext<T>();

    return (
        <ButtonGroup className="options main">
            <ButtonSimple
                type="button"
                onClick={handleReset}
                disabled={!dirty || isSubmitting}
            >
                {(i18n && i18n.reset) || "Reset"}
            </ButtonSimple>
            <ButtonPrimary
                type="submit"
                disabled={isSubmitting}
                name="@@SUBMIT"
                className="primary"
            >
                {(i18n && i18n.submit) || "Submit"} {(isValid && isInitialValid) && "✔"}
            </ButtonPrimary>
        </ButtonGroup>
    );
}

const MemoFormOptions = typedMemo(FormOptions);

export {MemoFormOptions as FormOptions};
