import React from "react";
import {Schema, string} from "yup";
import {ErrorMessage, FieldArray, FormikErrors, FormikTouched, getIn} from "formik";
import styled from "styled-components";

import {getDefault} from "./utils";
import Fields, {SchemaWithFields, Field, InputFeedback} from "./Fields";

type ArrayProps<T extends object> = {
    schema: SchemaWithFields<T>;
    field: Schema<T> & Field<T>;
    values: T;
    errors: FormikErrors<T>;
    touched: FormikTouched<T>;
    isSubmitting: boolean;
    fullPath: string;
    setFieldValue: (field: keyof T & string, value: any, shouldValidate?: boolean) => void;
    setFieldTouched: (field: keyof T & string, isTouched?: boolean, shouldValidate?: boolean) => void;
}

const SubSectionContainer = styled.fieldset`
  margin: 20px 0 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
`;

const SubSection = styled(SubSectionContainer)`
  margin-top: 0;
`;

const Legend = styled.legend`
  padding: 2px 20px;
  background-color: #eee;
  border-radius: 1em;
`;

function Array<T extends object>({schema, field, values, errors, touched, isSubmitting, fullPath, setFieldValue, setFieldTouched}: ArrayProps<T>) {
    const value: string[] = getIn(values, fullPath);
    const {label, tests} = field.describe();
    const {itemLabel} = field._meta;
    const error = getIn(errors, fullPath);

    const {min, max} = tests.reduce((o: {min: number; max: number | undefined}, test: { name: string; params: any }) => {
        if (test.name === "min") {
            o.min = test.params.min;
        } else if (test.name === "max") {
            o.max = test.params.max;
        }
        return o;
    }, {min: 0, max: undefined});

    const itemsCount = (value && value.length) || 0;

    return (
        <FieldArray
            key={fullPath}
            name={fullPath}
            render={arrayHelpers => {
                const AddOption = ((!max || itemsCount < max) && (
                    <button
                        disabled={isSubmitting}
                        name="@@ADD_ITEM"
                        value={fullPath}
                        onClick={(e) => {
                            e.preventDefault();
                            arrayHelpers.push(getDefault(schema, fullPath))
                        }}
                    >
                        Add {itemLabel || label}
                    </button>
                )) || null;

                return (
                    <SubSectionContainer>
                        {label && <Legend>{label}</Legend>}
                        {typeof error === "string" && <ErrorMessage name={fullPath}>
                            {message => <InputFeedback>{message}</InputFeedback>}
                        </ErrorMessage>
                        }

                        {value && value.map((value, index) => {
                            const itemFullPath = `${fullPath}.${index}`;
                            const RemoveOption = (itemsCount > min && (
                                <button
                                    disabled={isSubmitting}
                                    name="@@REMOVE_ITEM"
                                    value={itemFullPath}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        arrayHelpers.remove(index)
                                    }}
                                >
                                    Remove {itemLabel || label}
                                </button>
                            )) || null;

                            const InsertOption = ((!max || itemsCount < max) && (
                                <button
                                    disabled={isSubmitting}
                                    name="@@INSERT_ITEM"
                                    value={itemFullPath}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        arrayHelpers.insert(index, getDefault(schema, fullPath))
                                    }}
                                >
                                    Insert {itemLabel || label}
                                </button>
                            )) || null;

                            return (
                                <SubSection
                                    key={itemFullPath}
                                >
                                    <Fields
                                        schema={schema}
                                        fields={field._subType.fields}
                                        values={values}
                                        errors={errors}
                                        touched={touched}
                                        setFieldValue={setFieldValue}
                                        setFieldTouched={setFieldTouched}
                                        isSubmitting={isSubmitting}
                                        path={itemFullPath}
                                    />
                                    {InsertOption}
                                    {RemoveOption}
                                </SubSection>
                            );
                        })}
                        {AddOption}
                    </SubSectionContainer>
                )}}
        />
    )
}

export default Array;
