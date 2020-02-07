import React, {ReactNode} from "react";
import {useFormikContext} from "formik";

import {ButtonSimple} from "components/Buttons";

import {typedMemo} from "../types";

type FormOptionsProps = {
    children: ReactNode;
}

function FormOptionsReset<T>({children}: FormOptionsProps) {
    const {handleReset, dirty, isSubmitting} = useFormikContext<T>();

    return (
        <ButtonSimple
            type="button"
            onClick={handleReset}
            disabled={!dirty || isSubmitting}
        >
            {children}
        </ButtonSimple>
    );
}

const MemoFormOptionsReset = typedMemo(FormOptionsReset);

export {MemoFormOptionsReset as Reset};
