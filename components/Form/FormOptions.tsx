import React from "react";
import {useFormikContext} from "formik";

import {typedMemo} from "./types";

type FormOptionsProps = {
    i18n?: {
        reset: string;
        submit: string;
    }
}

function FormOptions<T>({i18n}: FormOptionsProps) {
    const {handleReset, dirty, isSubmitting, isValid, isInitialValid} = useFormikContext<T>();

    return (
        <aside className="options main">
            <button
                type="button"
                onClick={handleReset}
                disabled={!dirty || isSubmitting}
            >
                {(i18n && i18n.reset) || "Reset"}
            </button>
            <button
                type="submit"
                disabled={isSubmitting}
                name="@@SUBMIT"
                className="primary"
            >
                {(i18n && i18n.submit) || "Submit"} {(isValid && isInitialValid) && "✔"}
            </button>
        </aside>
    );
}

const MemoFormOptions = typedMemo(FormOptions);

export {MemoFormOptions as FormOptions};
