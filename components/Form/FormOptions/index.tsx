import React from "react";
import {useFormikContext} from "formik";
import {ButtonGroup} from "components/Buttons";

import {typedMemo} from "../types";

import {Submit} from "./Submit";
import {Reset} from"./Reset";

type FormOptionsProps = {
    i18n?: {
        reset: string;
        submit: string;
    };
}

function FormOptions<T>({i18n}: FormOptionsProps) {
    const {isValid, isInitialValid} = useFormikContext<T>();

    return (
        <ButtonGroup className="options main">
            <Reset>
                {(i18n && i18n.reset) || "Reset"}
            </Reset>
            <Submit>
                {(i18n && i18n.submit) || "Submit"} {(isValid && isInitialValid) && "✔"}
            </Submit>
        </ButtonGroup>
    );
}

const MemoFormOptions = typedMemo(FormOptions);

export {MemoFormOptions as FormOptions};

export * from "./Reset";
export * from "./Submit";
