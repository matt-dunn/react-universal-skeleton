import {Schema, SchemaDescription, string} from "yup";
import {ErrorMessage, FormikErrors, FormikTouched, getIn, Field, useFormikContext} from "formik";
import FormLabel from "./Label";
import React, {ComponentType, useContext, useMemo} from "react";
import styled from "styled-components";
import {formStyles} from "./index";
import Array from "./Array";
import {FormContext} from "./utils";

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
    tests: Array<{ name: string; params: object; OPTIONS: {name: string; params: any} }>;
}

export type Fields<T> = {
    [field: string]: Schema<T> & Field<T>;
};

type FieldProps<T> = {
    // schema: SchemaWithFields<T>;
    fields: Fields<T>;
    // values: T;
    // errors: FormikErrors<T>;
    // touched: FormikTouched<T>;
    // isSubmitting: boolean;
    path?: string;
    children?: (map: any) => JSX.Element;
    // setFieldValue: (field: keyof T & string, value: any, shouldValidate?: boolean) => void;
    // setFieldTouched: (field: keyof T & string, isTouched?: boolean, shouldValidate?: boolean) => void;
}

export interface SchemaWithFields<T> extends Schema<T> {
    fields?: Fields<T>;
}

const Section = styled.section`
  margin: 0 0 10px 0;
`;

export const InputFeedback = styled.label`
  color: red;
  display: block;
  margin: 5px 0 10px 0;
  
  em {
    font-style: normal;
  }
`;

const flattenFields = (fields, path, fieldPath = "") => {
    console.log("*******")
    return Object.keys(fields).reduce((map, key) => {
        const field = fields[key];

        if (field._type === "object") {
            const objectFields = flattenFields(field.fields, path, key)
            Object.keys(objectFields).forEach(category => {
                if (!map[category]) {
                    map[category] = [];
                }

                map[category] = map[category].concat(objectFields[category])
            })
        } else {
            const {category = "children"} = field._meta;

            if (!map[category]) {
                map[category] = [];
            }

            map[category].push({
                schema: field,
                fullPath: [path, fieldPath, key].filter(part => part).join(".")
            });
        }

        return map;
    }, {children: []})
}

function FieldSet<T>({fields, path = "", children}: FieldProps<T>) {
    const fieldSet = useMemo(() => flattenFields(fields, path), [fields, path]);

    return (children && children(fieldSet)) || (
        <>
            {Object.keys(fieldSet).map(key => {
                return (
                    <FieldsX
                        key={key}
                        fields={fieldSet[key]}
                    />
                )
            })}
        </>
    );
}

export function FieldsX<T extends object>({fields}: FieldProps<T>) {
    const {schema} = useContext(FormContext) || {}
    const {values, errors, touched, isSubmitting, setFieldValue, setFieldTouched} = useFormikContext();

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
                const field = fields[key].schema;
                const fullPath = fields[key].fullPath//[path, key].filter(part => part).join(".");

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
                } else if (field._type === "objectXXX") {
                    return (
                        <FieldSet
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
                            label={label}
                            name={fullPath}
                            field={field}
                        />
                        <Field
                            {...componentProps}
                            {...additionalProps}
                        />
                        <ErrorMessage name={fullPath}>
                            {message => <InputFeedback htmlFor={fullPath}><em>{message}</em></InputFeedback>}
                        </ErrorMessage>
                    </Section>
                )
            })}
        </>
    );
}

export default FieldSet;
