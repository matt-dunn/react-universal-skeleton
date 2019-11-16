import React, {ComponentType, ReactElement} from "react";
import {Schema} from "yup";
import {FormikErrors, FormikTouched} from "formik";

import {FormDataState} from "components/actions/form";
import {ErrorLike} from "components/error";

export interface ComponentTypes {
    // button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
    textarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
    radio: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    autoselect: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement|HTMLSelectElement>, HTMLInputElement|HTMLSelectElement>;
}

export type FormComponent = keyof ComponentTypes | ComponentType<any>;

export interface FieldMeta<Props = any> {
    Component?: FormComponent;
    props?: Props;
    order?: number;
    itemLabel?: string;
    category?: string;

}

export interface Field<T = any, Props = any> extends Schema<T> {
    _meta?: FieldMeta<Props>;
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
    controlFocus: FlattenInterpolation<any>;
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

export type FormContextType<T, Payload, Context> = {
    schema: Field<T>;
    formData: FormDataState<T, Payload, Context>;
}

export type FormMetaData<Context, Payload> = {
    formId: string;
    context?: Context;
    error?: ErrorLike;
    payload?: Payload;
}

export interface FieldSetChildrenProps<T, Payload, Context> {
    fieldsetMap: FieldSetMap<T>;
    metadata: FormMetaData<Context, Payload>;
    isComplete: boolean;
}

export type FieldSetChildren<T, Payload, Context> = {
    ({fieldsetMap, metadata}: FieldSetChildrenProps<T, Payload, Context>): ReactElement<any>;
}

export type CompleteChildrenProps<T, Payload, Context> = {
    values: T;
    metadata: FormMetaData<Context, Payload>;
}

export type CompleteChildren<T, Payload, Context> = {
    ({values, metadata}: CompleteChildrenProps<T, Payload, Context>): ReactElement<any>;
}

export const typedMemo: <T>(c: T) => T = React.memo;
