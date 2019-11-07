import React, {useContext} from "react";
import {string} from "yup";
import {ErrorMessage, getIn, Field, useFormikContext} from "formik";

import {FormLabel} from "./Label";
import {formStyles, InputFeedback, Section} from "./styles";
import {Array} from "./Array";
import {FormContext} from "./utils";
import {FieldMap, FieldSetMap, FormMetaData, typedMemo} from "./types";

export type FieldSetProps<T, P, S> = {
    fields?: FieldMap<T>[];
    children?: (map: FieldSetMap<T>, metadata: FormMetaData<S, P>) => JSX.Element;
    className?: string;
}

function FieldSet<T, P, S>({fields, children, className}: FieldSetProps<T, P, S>) {
    const {schema} = useContext(FormContext) || {};
    const {values, errors, touched, isSubmitting, setFieldValue, setFieldTouched} = useFormikContext<T>();

    const handleChange = (e: React.ChangeEvent<HTMLFormElement>, value?: string) => setFieldValue(((e.target && e.target.name) || e) as keyof T & string, (e.target && e.target.value) || value || "");

    const handleBlur = (e: any) =>  setFieldTouched((e.target && e.target.name) || e, true);

    return (
        <>
            {fields && fields.map(item => {
                const field = item.schema;
                const fullPath = item.fullPath;

                if (schema && field._type === "array") {
                    return (
                        <Array
                            key={fullPath}
                            field={field}
                            path={fullPath}
                            className={className}
                        >
                            {children}
                        </Array>
                    )
                }

                const {label} = field.describe();
                const {Component, props} = {Component: "input", ...field._meta};
                const value: string[] = getIn(values, fullPath);
                const error = getIn(errors, fullPath);
                const touch = getIn(touched, fullPath);
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
                        className={className}
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

const MemoFieldSet = typedMemo(FieldSet);

export {MemoFieldSet as FieldSet};
