import {string} from "yup";
import {ErrorMessage, getIn, Field as FormikField, useFormikContext} from "formik";
import FormLabel from "./Label";
import React, {useContext} from "react";
import styled from "styled-components";
import {formStyles} from "./index";
import Array from "./Array";
import {FormContext} from "./utils";
import {FieldMap} from "./types";

export type FieldSetProps<T> = {
    fields: FieldMap<Partial<T>>[];
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
    const {values, errors, touched, isSubmitting, setFieldValue, setFieldTouched} = useFormikContext<T>();
console.log("??",fields)
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
            {fields.sort((a, b) => ((a.schema._meta || {}).order || 0) - ((b.schema._meta || {}).order || 0)).map(item => {
                const field = item.schema;
                const fullPath = item.fullPath;

                const {label} = field.describe();
                const {Component, props} = {Component: "input", ...field._meta};
                const value: string[] = getIn(values, fullPath);
                const error = getIn(errors, fullPath);
                const touch = getIn(touched, fullPath);

                if (schema && field._type === "array") {
                    return (
                        <Array
                            key={fullPath}
                            schema={schema}
                            field={field}
                            values={values}
                            errors={errors}
                            isSubmitting={isSubmitting}
                            fullPath={fullPath}
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
                        <FormikField
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
