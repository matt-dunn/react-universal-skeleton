import {ComponentType} from "react";
import {Schema, SchemaDescription} from "yup";
import {FlattenInterpolation} from "styled-components";
import {FormikErrors, FormikTouched} from "formik";

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

export type FormContextType = {
    schema: SchemaWithFields<any>;
}


