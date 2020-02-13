import React, {useContext} from "react";
import {ErrorMessage, getIn, Field, useFormikContext} from "formik";

import {FormLabel} from "./Label";
import {formStyles} from "./styles";
import {Array} from "./Array";
import {buildId, FormContext, getTypeProps, useFormContext} from "./utils";
import {FieldMap, FieldSetChildren, typedMemo} from "./types";

type FieldSetProps<T, P, S> = {
    fields?: FieldMap<T>[];
    children?: FieldSetChildren<T, P, S>;
    className?: string;
}

function FieldSet<T, P, S>({fields, children, className}: FieldSetProps<T, P, S>) {
    const {schema} = useContext(FormContext) || {};
    const {values, errors, touched, isSubmitting, setFieldValue, setFieldTouched} = useFormikContext<T>();
    const {formData} = useFormContext<T, P, S>();

    const handleChange = (e: React.ChangeEvent<HTMLFormElement> | string, value?: string) => {
        if (typeof e === "string") {
            setFieldValue(e as keyof T & string, value === undefined ? "" : value);
        } else {
            setFieldValue((e.target && e.target.name) as keyof T & string, (e.target && e.target.value) === undefined ? "" : (e.target && e.target.value));
        }
    };

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
                    );
                }

                const {label} = field.describe();
                const value = getIn(values, fullPath);
                const error = getIn(errors, fullPath);
                const touch = getIn(touched, fullPath);
                const isValid = !(error && touch);
                const isRequired = field.tests.filter(test => test.OPTIONS.name === "required").length > 0;
                const fieldId = buildId(formData.state.formId, fullPath);
                const fieldIdError = `${fieldId}-error`;
                const additionalProps = {
                    isValid,
                    formStyles
                };
                const {Component, props} = getTypeProps(field, additionalProps);

                const componentProps = {
                    ...props,
                    id: fieldId,
                    name: fullPath,
                    value,
                    onChange: handleChange,
                    onBlur: handleBlur,
                    disabled: isSubmitting,
                    className: (!isValid && "invalid") || ""
                };

                const ariaProps = {
                    "aria-invalid": (!isValid && "true") || null,
                    "aria-required": (isRequired && "true") || null,
                    "aria-describedby": (!isValid && fieldIdError) || null
                };

                return (
                    <section
                        key={fullPath}
                        className={className}
                        data-type={field._type}
                    >
                        <FormLabel
                            label={label}
                            id={fieldId}
                            field={field}
                        >
                            <Field
                                as={Component}
                                {...componentProps}
                                {...ariaProps}
                            />
                        </FormLabel>
                        <ErrorMessage name={fullPath}>
                            {message => <label className="feedback" id={fieldIdError} htmlFor={fieldId}><em>{message}</em></label>}
                        </ErrorMessage>
                    </section>
                );
            })}
        </>
    );
}

const MemoFieldSet = typedMemo(FieldSet);

export {MemoFieldSet as FieldSet};
