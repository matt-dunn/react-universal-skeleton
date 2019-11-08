import React, {ComponentType} from "react";
import {Schema, SchemaDescription, ValidationError} from "yup";
import {FlattenInterpolation} from "styled-components";
import {FormikErrors, FormikTouched} from "formik";

import {FormDataState} from "components/actions/form";

import {ErrorLike} from "../error";

export interface Field<T> extends SchemaDescription {
    _meta: {
        Component?: ComponentType<any> | string;
        props?: any;
        order?: number;
        itemLabel?: string;
        category?: string;
    };
    _type: string;
    _subType: {
        fields: Fields<T>;
    };
    fields: Fields<T>;
    tests: { name: string; params: object; OPTIONS: {name: string; params: any} }[];
}

export type Fields<T> = {
    [key: string]: Schema<T> & Field<T>;
};

export interface SchemaWithFields<T> extends Schema<T> {
    fields?: Fields<T>;
}

export type FormStyles = {
    control: FlattenInterpolation<any>;
    controlInvalid: FlattenInterpolation<any>;
}

export type InitialFormData<T> = {
    errors: FormikErrors<T>;
    touched: FormikTouched<T>;
}

export type FieldMap<T> = {
    schema: Schema<T> & Field<T>;
    fullPath: string;
}

export type FieldSetMap<T> = {
    [key: string]: FieldMap<Partial<T>>[];
}

export type FormContextType<T, P, S> = {
    schema: SchemaWithFields<any>;
    formData: FormDataState<T, P, ValidationError[], S>;
}

export type FormMetaData<C, P> = {
    formId: string;
    context?: C;
    error?: ErrorLike;
    payload?: P;
}

export type FieldSetChildrenProps<T, P, S> = {
    map: FieldSetMap<T>;
    metadata: FormMetaData<S, P>;
}

export type FieldSetChildren<T, P, S> = {
    ({map, metadata}: FieldSetChildrenProps<T, P, S>): JSX.Element;
}
export const typedMemo: <T>(c: T) => T = React.memo;
