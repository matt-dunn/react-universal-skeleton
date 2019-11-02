import {Schema, SchemaDescription, string} from "yup";
import {ErrorMessage, FieldArray, FormikErrors, FormikTouched, getIn, Field} from "formik";
import FormLabel from "./Label";
import React, {ComponentType} from "react";
import styled from "styled-components";
import {getDefault} from "./utils";
import {formStyles} from "./index";

interface Field<T> extends SchemaDescription {
    _meta: {
        Type?: ComponentType<any> | string;
        props?: any;
        order?: number;
    };
    _type: string;
    _subType: {
        fields: Fields<T>;
    };
    fields: Fields<T>;
    tests: Array<{ name: string; params: object; OPTIONS: {name: string} }>;
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
`

const SubSection = styled.fieldset`
  margin: 0 0 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
`

const Legend = styled.legend`
  padding: 2px 20px;
  background-color: #eee;
  border-radius: 1em;
`

const InputFeedback = styled.div`
  color: red;
  margin: 5px 0 10px 0;
`

function Fields<T extends object>({schema, fields, values, errors, touched, isSubmitting, path = "", setFieldValue, setFieldTouched}: FieldProps<T>) {
    const handleChange = (e: any, value?: string) => {
        if (e.target) {
            setFieldValue(e.target.name, e.target.value)
        } else {
            setFieldValue(e, value)
        }
    }

    const handleBlur = (e: any) => {
        setFieldTouched((e.target && e.target.name) || e, true)
    }

    return (
        <>
            {Object.keys(fields).sort((a, b) => ((fields[a]._meta || {}).order || 0) - ((fields[b]._meta || {}).order || 0)).map(key => {
                const field = fields[key];
                const fullPath = [path, key].filter(part => part).join(".");

                const {label, tests} = field.describe();
                const {Type, props} = {Type: "input", ...field._meta};
                const value: string[] = getIn(values, fullPath)
                const error = getIn(errors, fullPath)
                const touch = getIn(touched, fullPath)
                const FormElement = (typeof Type === "string" && styled(Type as any)``) || Type;

                if (field._type === "array") {
                    const {min, max} = tests.reduce((o: {min: number; max: number | undefined}, test: { name: string; params: any }) => {
                        if (test.name === "min") {
                            o.min = test.params.min;
                        } else if (test.name === "max") {
                            o.max = test.params.max;
                        }
                        return o;
                    }, {min: 0, max: undefined})

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
                                        Add Item
                                    </button>
                                )) || null;

                                return (
                                    <SubSection>
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
                                                    Remove Item
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
                                                    Insert Item
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
                                    </SubSection>
                                )}}
                        />
                    )
                } else if (field._type === "object") {
                    return (
                        <Fields
                            schema={schema}
                            key={fullPath}
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

                return (
                    <Section
                        key={fullPath}
                    >
                        <FormLabel
                            label={label} name={fullPath} field={field}
                        />
                        <Field
                            {...props}
                            as={FormElement}
                            id={fullPath}
                            name={fullPath}
                            value={value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={isSubmitting}
                            isValid={isValid}
                            className={(!isValid && "invalid") || ""}
                            formStyles={formStyles}
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
