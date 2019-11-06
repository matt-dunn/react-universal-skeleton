import React, {useMemo} from 'react'
import {Formik, setIn} from 'formik';
import * as Yup from 'yup';
import {ValidationError} from "yup";
import classnames from "classnames";

import {MapDataToAction, useForm} from "components/actions/form";

import {getDefault, FormContext, performAction} from "./utils";
import FieldSetWrapper from "./FieldWrapper";
import {FieldSetMap, FormMetaData, InitialFormData, SchemaWithFields} from "./types";

import {FormContainer, FormFooterOptions, InputFeedback} from "./styles";

export type FormProps<T, P, S> = {
    formId: string;
    schema: SchemaWithFields<T>;
    onSubmit: MapDataToAction<T, P, S>;
    children?: (map: FieldSetMap<T>, metadata: FormMetaData<S, P>) => JSX.Element;
    className?: string;
    context?: S;
}

function Form<T, P, S>({formId, schema, onSubmit, children, className, context}: FormProps<T, P, S>) {
    const [formData, submit] = useForm<Yup.InferType<typeof schema>, P, ValidationError[], typeof schema, S>(
        formId,
        schema,
        values => schema.validate(values, {abortEarly: false}),
        onSubmit as any,
        performAction,
        context
    );

    const formState = formData.state.toString();

    const {errors: initialErrors, touched: initialTouched} = useMemo<InitialFormData<Yup.InferType<typeof schema>>>(() => formData.innerFormErrors && formData.innerFormErrors.reduce(({errors, touched}, {path, message}) => ({
        errors: setIn(errors, path, message),
        touched: setIn(touched, path, true)
    }), {errors: {}, touched: {}}) || {}, [formData.innerFormErrors]);

    const initialValues: Yup.InferType<typeof schema> = formData.data || getDefault(schema);

    return (
        <FormContext.Provider value={{schema, formData}}>
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
                            id={formId}
                            onSubmit={handleSubmit}
                            method="post"
                            action={`#${formId}`}
                            className={classnames({invalid: !isValid}, className)}
                        >
                            <input
                                name="@@FORMSTATE"
                                value={formState}
                                type="hidden"
                                readOnly={true}
                            />

                            {formData.error && <InputFeedback>{formData.error.message}</InputFeedback>}

                            <FieldSetWrapper
                                fields={schema.fields}
                            >
                                {children}
                            </FieldSetWrapper>

                            <FormFooterOptions>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    disabled={!dirty || isSubmitting}
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    name="@@SUBMIT"
                                    className="primary"
                                >
                                    Submit {(isValid && isInitialValid) && "✔"}
                                </button>
                            </FormFooterOptions>
                        </FormContainer>
                    ) || null;
                }}
            </Formik>

            <pre style={{whiteSpace: "normal"}}>{JSON.stringify(formData.state)}</pre>
        </FormContext.Provider>
    )
}

const typedMemo: <T>(c: T) => T = React.memo;

export default typedMemo(Form)
