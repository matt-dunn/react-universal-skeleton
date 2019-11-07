import React, {useMemo} from "react";

import {Fields, FieldSetMap, FormMetaData, typedMemo} from "./types";
import {flattenFields, sortFields, useFormContext} from "./utils";
import {Collections} from "./Collections";

export type FieldSetWrapperProps<T, P, S> = {
    fields: Fields<T>;
    path?: string;
    children?: (map: FieldSetMap<T>, metadata: FormMetaData<S, P>) => JSX.Element;
}

function FieldSetWrapper<T, P, S>({fields, path = "", children}: FieldSetWrapperProps<T, P, S>) {
    const {formData} = useFormContext<T, P, S>();
    const fieldSet = useMemo<FieldSetMap<T>>(() => sortFields(flattenFields(fields, path)), [fields, path]);

    const metadata: FormMetaData<S, P> = useMemo(() => ({
        formId: formData.state.formId,
        context: formData.state.data,
        error: formData.error,
        payload: formData.payload
    }), [formData.error, formData.payload, formData.state.data, formData.state.formId]);

    return children ? children(fieldSet, metadata) : <Collections map={fieldSet}/>;
}

const MemoFieldSetWrapper = typedMemo(FieldSetWrapper);

export {MemoFieldSetWrapper as FieldSetWrapper};
