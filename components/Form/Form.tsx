import React, {useMemo, useRef} from 'react'
import {Formik, setIn} from 'formik';
import * as Yup from 'yup';
import {Schema} from "yup";
import classnames from "classnames";
import styled from '@emotion/styled'

import {MapDataToAction, useForm} from "components/actions/form";

import {getDefault, FormContext, performAction} from "./utils";
import {FieldSetWrapper} from "./FieldSetWrapper";
import {CompleteChildren, FieldSetChildren, FormMetaData, InitialFormData, Field, typedMemo} from "./types";
import {FormContainer} from "./styles";
import {FormValidationErrors} from "./FormValidationErrors";
import {FormErrorFocus} from "./FormErrorFocus";
import {FormOptions} from "./FormOptions";

type FormProps<S, Payload, Context> = {
    id: string;
    schema: Schema<S>;
    onSubmit: MapDataToAction<any, Payload, Context>;
    children?: FieldSetChildren<S, Payload, Context>;
    complete?: CompleteChildren<S, Payload, Context>;
    className?: string;
    context?: Context;
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
}

const FormWrapper = styled.form<{as: keyof JSX.IntrinsicElements | React.ComponentType<any>}>``;

function Form<S, Payload, Context>({id, schema, onSubmit, children, className, context, complete, as = FormContainer}: FormProps<S, Payload, Context>) {
    type T = Yup.InferType<typeof schema>;

    const [formData, handleSubmit] = useForm<T, Payload, typeof schema, Context>(
        id,
        schema,
        values => schema.validate(values, {abortEarly: false}),
        onSubmit,
        performAction,
        context
    );

    const extendedSchema: Field<S> = schema as Field<S>;
    const formRef = useRef<HTMLFormElement>(null);

    const formState = formData.state.toString();

    const {errors: initialErrors, touched: initialTouched} = useMemo<InitialFormData<T>>(() => formData.innerFormErrors && formData.innerFormErrors.reduce(({errors, touched}, {path, message}) => ({
        errors: setIn(errors, path, message),
        touched: setIn(touched, path, true)
    }), {errors: {}, touched: {}}) || {} as InitialFormData<T>, [formData.innerFormErrors]);

    const initialValues: T = formData.data || getDefault(extendedSchema);

    return (
        <FormContext.Provider value={{schema: extendedSchema, formData}}>
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
                        const metadata: FormMetaData<Context, Payload> = {
                            formId: formData.state.formId,
                            context: formData.state.data,
                            error: formData.error,
                            payload: formData.payload
                        };

                        return (
                            <section
                                id={id}
                            >
                                {complete({values: schema.cast(values), metadata})}
                            </section>
                        )
                    }

                    return extendedSchema.fields && (
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
                                fields={extendedSchema.fields}
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
