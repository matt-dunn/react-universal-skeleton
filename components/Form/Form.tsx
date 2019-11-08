import React, {useMemo, useRef} from 'react'
import {Formik, setIn} from 'formik';
import * as Yup from 'yup';
import {ValidationError} from "yup";
import classnames from "classnames";

import {MapDataToAction, useForm} from "components/actions/form";

import {getDefault, FormContext, performAction, FormErrorFocus} from "./utils";
import {FieldSetWrapper} from "./FieldSetWrapper";
import {FieldSetChildren, InitialFormData, SchemaWithFields, typedMemo} from "./types";
import {FormContainer, FormFooterOptions, InputFeedback} from "./styles";

export type FormProps<T, P, S> = {
    formId: string;
    schema: SchemaWithFields<T>;
    onSubmit: MapDataToAction<T, P, S>;
    children?: FieldSetChildren<T, P, S>;
    className?: string;
    context?: S;
}

function Form<T, P, S>({formId, schema, onSubmit, children, className, context}: FormProps<T, P, S>) {
    const [formData, handleSubmit] = useForm<Yup.InferType<typeof schema>, P, ValidationError[], typeof schema, S>(
        formId,
        schema,
        values => schema.validate(values, {abortEarly: false}),
        onSubmit as any,
        performAction,
        context
    );

    const formRef = useRef<HTMLFormElement>(null);

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
                onSubmit={handleSubmit}
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
                            ref={formRef}
                            onSubmit={handleSubmit}
                            method="post"
                            action={`#${formId}`}
                            className={classnames({invalid: !isValid}, className)}
                        >
                            <FormErrorFocus formRef={formRef}/>

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

const MemoForm = typedMemo(Form);

export {MemoForm as Form};
