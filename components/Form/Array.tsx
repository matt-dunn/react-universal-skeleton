import React, {useMemo} from "react";
import {Schema, string} from "yup";
import {ErrorMessage, FieldArray, FormikErrors, FormikTouched, getIn} from "formik";
import styled from "styled-components";

import {getDefault} from "./utils";
import FieldSetWrapper from "./FieldWrapper";
import {Field, SchemaWithFields} from "./types";
import {InputFeedback} from "./FieldSet";

export type ArrayProps<T extends object> = {
    schema: SchemaWithFields<T>;
    field: Schema<T> & Field<T>;
    values: T;
    errors: FormikErrors<T>;
    isSubmitting: boolean;
    fullPath: string;
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

function Array<T extends object>({schema, field, values, errors, isSubmitting, fullPath}: ArrayProps<T>) {
    const value: string[] = getIn(values, fullPath);
    const {label} = field.describe();
    const {itemLabel} = field._meta;
    const error = getIn(errors, fullPath);

    const {min, max} = useMemo(() => field.tests.reduce((o: {min: number; max: number | undefined}, test: { OPTIONS: {name: string; params: any }}) => {
        if (test.OPTIONS.name === "min") {
            o.min = test.OPTIONS.params.min;
        } else if (test.OPTIONS.name === "max") {
            o.max = test.OPTIONS.params.max;
        }
        return o;
    }, {min: 0, max: undefined}), [field.tests]);

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
                            {message => <InputFeedback><em>{message}</em></InputFeedback>}
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
                                    <FieldSetWrapper
                                        fields={field._subType.fields}
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
