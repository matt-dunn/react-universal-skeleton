import {Schema, SchemaDescription, string} from "yup";
import {ErrorMessage, FormikErrors, FormikTouched, getIn, Field} from "formik";
import FormLabel from "./Label";
import React, {ComponentType} from "react";
import styled from "styled-components";
import {formStyles} from "./index";
import Array from "./Array";

export interface Field<T> extends SchemaDescription {
    _meta: {
        Component?: ComponentType<any> | string;
        props?: any;
        order?: number;
        itemLabel?: string;
    };
    _type: string;
    _subType: {
        fields: Fields<T>;
    };
    fields: Fields<T>;
    tests: Array<{ name: string; params: object; OPTIONS: {name: string, params: any} }>;
}

export type Fields<T> = {
    [field: string]: Schema<T> & Field<T>;
};

type FieldProps<T extends object> = {
    schema: SchemaWithFields<T>;
    fields: Fields<T>;
    values: T;
    errors: FormikErrors<T>;
    touched: FormikTouched<T>;
    isSubmitting: boolean;
    path?: string;
    setFieldValue: (field: keyof T & string, value: any, shouldValidate?: boolean) => void;
    setFieldTouched: (field: keyof T & string, isTouched?: boolean, shouldValidate?: boolean) => void;
}

export interface SchemaWithFields<T> extends Schema<T> {
    fields?: Fields<T>;
}

const Section = styled.div`
  margin: 0 0 10px 0;
`;

export const InputFeedback = styled.div`
  color: red;
  margin: 5px 0 10px 0;
`;

function Fields<T extends object>({schema, fields, values, errors, touched, isSubmitting, path = "", setFieldValue, setFieldTouched}: FieldProps<T>) {
    const handleChange = (e: any, value?: string) => {
        if (e.target) {
            setFieldValue(e.target.name, e.target.value);
        } else {
            setFieldValue(e, value);
        }
    };

    const handleBlur = (e: any) => {
        setFieldTouched((e.target && e.target.name) || e, true);
    };

    return (
        <>
            {Object.keys(fields).sort((a, b) => ((fields[a]._meta || {}).order || 0) - ((fields[b]._meta || {}).order || 0)).map(key => {
                const field = fields[key];
                const fullPath = [path, key].filter(part => part).join(".");

                const {label} = field.describe();
                const {Component, props} = {Component: "input", ...field._meta};
                const value: string[] = getIn(values, fullPath);
                const error = getIn(errors, fullPath);
                const touch = getIn(touched, fullPath);

                if (field._type === "array") {
                    return (
                        <Array
                            key={fullPath}
                            schema={schema}
                            field={field}
                            values={values}
                            errors={errors}
                            touched={touched}
                            isSubmitting={isSubmitting}
                            fullPath={fullPath}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}/>
                    )
                } else if (field._type === "object") {
                    return (
                        <Fields
                            key={fullPath}
                            schema={schema}
                            fields={field.fields}
                            values={values}
                            errors={errors}
                            touched={touched}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            isSubmitting={isSubmitting}
                            path={fullPath}
                        />
                    )
                }

                const isValid = !(error && touch);

                const componentProps = {
                    ...props,
                    as: Component,
                    id: fullPath,
                    name: fullPath,
                    value,
                    onChange: handleChange,
                    onBlur: handleBlur,
                    disabled: isSubmitting,
                    className: (!isValid && "invalid") || ""
                };

                const additionalProps = typeof Component !== "string" && {
                    isValid,
                    formStyles
                };

                return (
                    <Section
                        key={fullPath}
                    >
                        <FormLabel
                            label={label} name={fullPath} field={field}
                        />
                        <Field
                            {...componentProps}
                            {...additionalProps}
                        />
                        <ErrorMessage name={fullPath}>
                            {message => <InputFeedback>{message}</InputFeedback>}
                        </ErrorMessage>
                    </Section>
                )
            })}
        </>
    );
}

export default Fields;
