import React, {useMemo} from 'react'
import styled, {css} from "styled-components";
import immutable from "object-path-immutable";
import {
    Formik,
    setIn
} from 'formik';
import * as Yup from 'yup';
import {ValidationError} from "yup";

import useWhatChanged from "components/whatChanged/useWhatChanged";

import {ActionType, MapDataToAction, useForm} from "components/actions/form";
import {getDefault, FormContext} from "./utils";
import FieldSetWrapper from "./FieldWrapper";
import {FormStyles, InitialFormData, SchemaWithFields} from "./types";

export type FormProps<T, P> = {
    schema: SchemaWithFields<T>;
    onSubmit: MapDataToAction<any, P>;
}

export const formStyles: FormStyles = {
    control: css`
        font-size: inherit;
        border: 1px solid rgb(204, 204, 204);
        border-radius: 4px;
    `,
    controlInvalid: css`
        border-color: red;
    `
}

const FormContainer = styled.form`
  border: 1px solid #ccc;
  background-color: #fdfdfd;
  border-radius: 4px;
  padding: 10px;
  margin: 20px 0;
  box-sizing: border-box;
  
  button {
    font-size: inherit;
    padding: 5px;
    border: 1px solid #ccc;
    background-color: #eee;
    border-radius: 3px;
    margin: 10px 8px 10px 0;
  }
  
  input {
    padding: 9px 8px;
    ${formStyles.control};
    width: 100%;
  }
  
  textarea {
    padding: 9px 8px;
    ${formStyles.control};
    min-width: 100%;
    min-height: 10em;
  }
  
  input,
  textarea {
      &.invalid {
        border-color: red;
      }
  }
`;

const InputFeedback = styled.div`
  color: red;
  margin: 5px 0 10px 0;
`;

function performAction<T>(schema: any, action: ActionType, data: T, value?: string): T | undefined | null {
    switch (action) {
        case "add": {
            return (value && immutable.push(data, value, getDefault(schema, value))) || data;
        }
        case "remove": {
            return immutable.del(data, value)
        }
        case "insert": {
            if (value) {
                const parts = value.split(".");
                const index = parseInt(parts.slice(-1).join("."), 10);
                const path = parts.slice(0, -1).join(".");
                return immutable.insert(data, path, getDefault(schema, value), index)
            }
            break;
        }
    }
}

function Form<T, P>({schema, onSubmit, children}: FormProps<T, P>) {
    const [formData, submit] = useForm<Yup.InferType<typeof schema>, P, ValidationError[]>(
        schema,
        values => schema.validate(values, {abortEarly: false}),
        onSubmit,
        performAction
    );

    const {errors: initialErrors, touched: initialTouched} = useMemo<InitialFormData<Yup.InferType<typeof schema>>>(() => formData.innerFormErrors && formData.innerFormErrors.reduce(({errors, touched}, {path, message}) => ({
        errors: setIn(errors, path, message),
        touched: setIn(touched, path, true)
    }), {errors: {}, touched: {}}) || {}, [formData.innerFormErrors]);

    const initialValues: Yup.InferType<typeof schema> = formData.data || getDefault(schema);

    console.log("@@@INITIAL DATA", initialValues)

    useWhatChanged(Form, { formData, submit, initialValues });

    return (
        <FormContext.Provider value={{schema}}>
            {formData.payload && <pre>{JSON.stringify(formData.payload)}</pre>}

            <Formik
                initialValues={initialValues}
                initialErrors={initialErrors}
                initialTouched={initialTouched}
                onSubmit={values => submit(values)}
                validationSchema={schema}
            >
                {props => {
                    const {
                        values,
                        touched,
                        errors,
                        dirty,
                        isSubmitting,
                        handleSubmit,
                        handleReset,
                        setFieldTouched,
                        setFieldValue,
                        isValid,
                        isInitialValid
                    } = props;

                    if (schema.fields) {
                        return (
                            <FormContainer onSubmit={handleSubmit} method="post" className={(!isValid && "invalid") || ""}>
                                {formData.error &&
                                <InputFeedback>There was a problem submitting: {formData.error.message}</InputFeedback>}

                                <FieldSetWrapper
                                    fields={schema.fields}
                                    children={children}
                                />

                                <p>
                                    <button
                                        type="button"
                                        className="outline"
                                        onClick={handleReset}
                                        disabled={!dirty || isSubmitting}
                                    >
                                        Reset
                                    </button>
                                    <button type="submit" disabled={isSubmitting} name="@@SUBMIT">
                                        Submit {(isValid && isInitialValid) && "✔"}
                                    </button>
                                </p>
                            </FormContainer>
                        );
                    }

                    return null;
                }}
            </Formik>
        </FormContext.Provider>
    )
}

export default React.memo(Form)
