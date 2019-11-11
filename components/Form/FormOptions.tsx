import React from "react";
import {useFormikContext} from "formik";

import {typedMemo} from "./types";

function FormOptions<T>() {
    const {handleReset, dirty, isSubmitting, isValid, isInitialValid} = useFormikContext<T>();

    return (
        <aside className="options main">
            <button
                type="button"
                onClick={handleReset}
                disabled={!dirty || isSubmitting}
            >
                Reset
            </button>
            <button
                type="submit"
                disabled={isSubmitting}
                name="@@SUBMIT"
                className="primary"
            >
                Submit {(isValid && isInitialValid) && "✔"}
            </button>
        </aside>
    )
}

const MemoFormOptions = typedMemo(FormOptions);

export {MemoFormOptions as FormOptions};
