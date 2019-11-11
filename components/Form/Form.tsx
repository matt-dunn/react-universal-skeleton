import React, {useMemo, useRef} from 'react'
import {Formik, setIn} from 'formik';
import * as Yup from 'yup';
import classnames from "classnames";
import styled from "styled-components";

import {MapDataToAction, useForm} from "components/actions/form";

import {getDefault, FormContext, performAction} from "./utils";
import {FieldSetWrapper} from "./FieldSetWrapper";
import {CompleteChildren, FieldSetChildren, FormMetaData, InitialFormData, SchemaWithFields, typedMemo} from "./types";
import {FormContainer} from "./styles";
import {FormValidationErrors} from "./FormValidationErrors";
import {FormErrorFocus} from "./FormErrorFocus";
import {FormOptions} from "./FormOptions";

export type FormProps<T, P, S> = {
    id: string;
    schema: SchemaWithFields<T>;
    onSubmit: MapDataToAction<T, P, S>;
    children?: FieldSetChildren<T, P, S>;
    complete?: CompleteChildren<Yup.InferType<SchemaWithFields<T>>, P, S>;
    className?: string;
    context?: S;
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
}

const FormWrapper = styled.form``;

function Form<T, P, S>({id, schema, onSubmit, children, className, context, complete, as = FormContainer}: FormProps<T, P, S>) {
    const [formData, handleSubmit] = useForm<Yup.InferType<typeof schema>, P, typeof schema, S>(
        id,
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
    }), {errors: {}, touched: {}}) || {} as InitialFormData<Yup.InferType<typeof schema>>, [formData.innerFormErrors, schema]);

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
                        handleSubmit,
                        isValid,
                        values,
                    } = props;

                    if (complete && formData.isComplete) {
                        const metadata: FormMetaData<S, P> = {
                            formId: formData.state.formId,
                            context: formData.state.data,
                            error: formData.error,
                            payload: formData.payload
                        };

                        return (
                            <section
                                id={id}
                            >
                                {complete({values, metadata})}
                            </section>
                        )
                    }

                    return schema.fields && (
                        <FormWrapper
                            id={id}
                            ref={formRef}
                            as={as}
                            onSubmit={handleSubmit}
                            method="post"
                            action={`#${id}`}
                            className={classnames({invalid: !isValid}, className)}
                        >
                            <FormErrorFocus formRef={formRef}/>

                            <FormValidationErrors errors={initialErrors}/>

                            <input
                                name="@@FORMSTATE"
                                value={formState}
                                type="hidden"
                                readOnly={true}
                            />

                            {(formData.error && formData.error.message) && <label className="feedback">{formData.error.message}</label>}

                            <FieldSetWrapper
                                fields={schema.fields}
                            >
                                {children}
                            </FieldSetWrapper>

                            {!children && <FormOptions/>}
                        </FormWrapper>
                    ) || null;
                }}
            </Formik>

            <pre style={{whiteSpace: "normal"}}>{JSON.stringify(formData.state)}</pre>
        </FormContext.Provider>
    )
}

const MemoForm = typedMemo(Form);

export {MemoForm as Form};
