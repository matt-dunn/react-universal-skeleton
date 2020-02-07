import React, {ReactNode} from "react";
import {useFormikContext} from "formik";
import {ButtonPrimary} from "components/Buttons";

import {typedMemo} from "../types";

type FormOptionsProps = {
    children: ReactNode;
}

function FormOptionsSubmit<T>({children}: FormOptionsProps) {
    const {isSubmitting} = useFormikContext<T>();

    return (
        <ButtonPrimary
            type="submit"
            disabled={isSubmitting}
            name="@@SUBMIT"
            className="primary"
        >
            {children}
        </ButtonPrimary>
    );
}

const MemoFormOptionsSubmit = typedMemo(FormOptionsSubmit);

export {MemoFormOptionsSubmit as Submit};
