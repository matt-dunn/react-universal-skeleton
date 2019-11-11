import React, {ComponentType} from "react";
import {Schema} from "yup";
import {FlattenInterpolation} from "styled-components";
import {FormikErrors, FormikTouched} from "formik";

import {FormDataState} from "components/actions/form";
import {ErrorLike} from "components/error";

export interface Field<T> extends Schema<T> {
    _meta: {
        Component?: ComponentType<any> | string;
        props?: any;
        order?: number;
        itemLabel?: string;
        category?: string;
    };
    _type: string;
    _subType: Field<T>;
    fields: Fields<T>;
    tests: { name: string; params: object; OPTIONS: {name: string; params: any} }[];
    getDefault: () => any;
}

export type Fields<T> = {
    [key: string]: Field<T>;
};

export type FormStyles = {
    control: FlattenInterpolation<any>;
    controlInvalid: FlattenInterpolation<any>;
}

export type InitialFormData<T> = {
    errors: FormikErrors<T>;
    touched: FormikTouched<T>;
}

export type FieldMap<T> = {
    schema: Field<T>;
    fullPath: string;
}

export type FieldSetMap<T> = {
    [key: string]: FieldMap<Partial<T>>[];
}

export type FormContextType<T, P, S> = {
    schema: Field<T>;
    formData: FormDataState<T, P, S>;
}

export type FormMetaData<C, P> = {
    formId: string;
    context?: C;
    error?: ErrorLike;
    payload?: P;
}

export interface FieldSetChildrenProps<T, P, S> {
    fieldsetMap: FieldSetMap<T>;
    metadata: FormMetaData<S, P>;
    isComplete: boolean;
}

export type FieldSetChildren<T, P, S> = {
    ({fieldsetMap, metadata}: FieldSetChildrenProps<T, P, S>): JSX.Element;
}

export type CompleteChildrenProps<T, P, S> = {
    values: T;
    metadata: FormMetaData<S, P>;
}

export type CompleteChildren<T, P, S> = {
    ({values, metadata}: CompleteChildrenProps<T, P, S>): JSX.Element;
}

export const typedMemo: <T>(c: T) => T = React.memo;
