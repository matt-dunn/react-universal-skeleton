import {Schema, SchemaDescription, string} from "yup";
import {ErrorMessage, FormikErrors, FormikTouched, getIn, Field, useFormikContext} from "formik";
import FormLabel from "./Label";
import React, {ComponentType, useContext, useMemo} from "react";
import styled from "styled-components";
import {formStyles} from "./index";
import Array from "./Array";
import {FormContext} from "./utils";
import {Fields} from "./types";

export type FieldSetProps<T> = {
    fields: Fields<T>;
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

export function FieldSet<T extends object>({fields}: FieldSetProps<T>) {
    const {schema} = useContext(FormContext) || {};
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
