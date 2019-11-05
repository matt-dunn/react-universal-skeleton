import React, {useMemo} from 'react'
import {Formik, setIn} from 'formik';
import * as Yup from 'yup';
import {ValidationError} from "yup";
import classnames from "classnames";

import {MapDataToAction, useForm} from "components/actions/form";

import {getDefault, FormContext, performAction} from "./utils";
import FieldSetWrapper from "./FieldWrapper";
import {FieldSetMap, InitialFormData, SchemaWithFields} from "./types";

import {FormContainer, InputFeedback} from "./styles";

import useWhatChanged from "components/whatChanged/useWhatChanged";

export type FormProps<T, P> = {
    schema: SchemaWithFields<T>;
    onSubmit: MapDataToAction<any, P>;
    children?: (map: FieldSetMap<T>) => JSX.Element;
    className?: string;
}

function Form<T, P>({schema, onSubmit, children, className}: FormProps<T, P>) {
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
                        dirty,
                        isSubmitting,
                        handleSubmit,
                        handleReset,
                        isValid,
                        isInitialValid
                    } = props;

                    return schema.fields && (
                        <FormContainer
                            onSubmit={handleSubmit}
                            method="post"
                            className={classnames({invalid: !isValid}, className)}
                        >
                            {formData.error &&
                            <InputFeedback>There was a problem submitting: {formData.error.message}</InputFeedback>}

                            <FieldSetWrapper
                                fields={schema.fields}
                            >
                                {children}
                            </FieldSetWrapper>

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
                    ) || null;
                }}
            </Formik>
        </FormContext.Provider>
    )
}

export default React.memo(Form)
