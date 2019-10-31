import React, {useMemo} from 'react'
import styled, {css} from "styled-components";

import {
    Formik,
    ErrorMessage,
    Field,
    useField,
    FieldAttributes,
    useFormikContext,
    setIn,
    getIn,
    FormikErrors,
    FormikTouched
} from 'formik';
import * as Yup from 'yup';
import {ValidationError, Schema} from "yup";

import useWhatChanged from "components/whatChanged/useWhatChanged";

import {useForm} from "components/actions/form";
import FormLabel from "app/components/Form/Label";
import FancySelect from "app/components/FancySelect";

const Form = styled.form`
  border: 1px solid #ccc;
  background-color: #fdfdfd;
  border-radius: 4px;
  padding: 10px;
  margin: 20px 0;
`;

const Button = styled.button`
  font-size: inherit;
  padding: 5px;
  border: 1px solid #ccc;
  background-color: #eee;
  border-radius: 3px;
  margin: 10px 8px 10px 0;
`

const Input = styled.input<{isValid?: boolean}>`
  && {
  font-size: inherit;
  border: 1px solid rgb(204, 204, 204);
  padding: 9px 8px;
  border-radius: 4px;
  ${({isValid}) => !isValid && css`border-color: red`};
  }
`

const InputFeedback = styled.div`
  color: red;
  margin: 5px 0 10px 0;
`

const Section = styled.div`
  margin: 0 0 10px 0;
`

const options = [
    { value: '', label: 'Select...' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

type MyFormResponse = {
    chosenFlavour: string;
    yourEmail: string;
}

const validateEmailApi = (function() {
    let t: number;

    return (email: string): Promise<boolean | ValidationError> => {
        console.log("#####VALIDATE EMAIL")
        clearTimeout(t);
        return new Promise((resolve, reject) => {
            if (email === "matt.j.dunn@gmail.com") {
                throw new Error("Email validation failed")
            }

            t = setTimeout(() => {
                // reject(new Error("Email validation failed"))
                resolve(!email.startsWith("demo@"))
            }, 1500)
        })
    }
})()

const schema = Yup.object().shape({
    email: Yup.string()
        .label("Email")
        .meta({
            order: 0,
            Type: Input,
            props: {
                placeholder: "Enter your email",
                type: "text"
            }
        })
        .required('Email is required')
        .email()
        .test("email", "Email ${value} is unavailable", function(value: string) {
            if (!value || !Yup.string().email().isValidSync(value)) {
                return true;
            } else {
                return validateEmailApi(value)
                    .catch(reason => new ValidationError(reason.message, value, this.path))
            }
        }),
    flavour: Yup.object()
        .meta({
            order: 1
        })
        .shape({
        favourite: Yup.string()
            .label("Flavour")
            .meta({
                order: 1,
                Type: FancySelect,
                props: {
                    options: [
                        { value: '', label: 'Select...' },
                        { value: 'chocolate', label: 'Chocolate' },
                        { value: 'strawberry', label: 'Strawberry' },
                        { value: 'vanilla', label: 'Vanilla' },
                    ]
                }
            })
            .required('Flavour is required')
    })
});

const dummyApiCall = (flavour: string, email: string): Promise<MyFormResponse> => {
    console.log("#####CALL API")
    return new Promise((resolve, reject) => {
        if (flavour === "vanilla") {
            // throw new APIError("Authentication Failed", "auth", 403)
            throw new Error("Don't like VANILLA!!!")
        }

        setTimeout(() => {
            resolve({chosenFlavour: `FLAVOUR: ${flavour}`, yourEmail: `EMAIL: ${email}`})
        }, 2000);
    })
};

// const MyField = ({ setFieldError, setStatus, status, ...props }: FieldAttributes<any> & {setFieldError: (field: string, value: string | undefined) => void; setStatus: (status: any) => void; status: any}) => {
//     const {errors} = useFormikContext();
//
//     const fieldSchema:any = schema[props.name];
//     const fieldSchemaAsync:any = schema[`${props.name}Async`];
//
//     console.log("#FIELD", props.name)
//
//     const validateField = (value: string) => {
//         console.log("#VAL", value)
//         return fieldSchema.validate(value)
//             .then(() => {
//                 console.log("#VAL=OK1", value)
//                 if (fieldSchemaAsync) {
//                     if (status && status.email && status.email.value === value) {
//                         // return "";
//                         return errors[props.name];
//                     }
//
//                     setFieldError(props.name, "");
//
//                     return fieldSchemaAsync.validate(value, {context: {setFieldError, setStatus}})
//                         .then(() => {
//                             setFieldError(props.name, "");
//                             return "";
//                         })
//                         .catch(reason => {
//                             setFieldError(props.name, reason.message);
//                             return reason.message;
//                         })
//                 }
//                 return "";
//             })
//             .catch(reason => {
//                 setFieldError(props.name, reason.message);
//                 return reason.message;
//             })
//             .finally(() => {
//                 setStatus({...status, email: {value: value}});
//             })
//     }
//
//     const {validate, ...fieldProps} = props
//
//     return (
//         <Field {...fieldProps} />
//     );
// };

type InitialFormData<T> = {
    errors: FormikErrors<T>;
    touched: FormikTouched<T>;
}

const Fields = ({fields, values, errors, touched, isSubmitting, path = "", setFieldValue, setFieldTouched}) => {

    const handleChange = (e, value) => {
        if (e.target) {
            setFieldValue(e.target.name, e.target.value)
        } else {
            setFieldValue(e, value)
        }
    }

    const handleBlur = (e) => {
        setFieldTouched((e.target && e.target.name) || e, true)
    }

    return (
        <>
            {Object.keys(fields).sort((a, b) => ((fields[b]._meta || {}).order || 0) - ((fields[a]._meta || {}).order || 0)).map(key => {
                const field = fields[key];
                const fullPath = [path, key].filter(part => part).join(".");
                const {Type, props} = field._meta || {};
                const value = getIn(values, fullPath)
                const error = getIn(errors, fullPath)
                const touch = getIn(touched, fullPath)
                // console.log(">>>", field, fullPath)
                return (
                    field.fields ?
                        <Fields
                            key={key}
                            fields={field.fields}
                            values={values}
                            errors={errors}
                            touched={touched}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            isSubmitting={isSubmitting}
                            path={key}
                        />
                        :
                        <Section
                            key={key}
                        >
                            <FormLabel
                                label={field._label} name={fullPath} schema={schema}/>
                            <Field
                                {...props}
                                as={Type}
                                id={fullPath}
                                name={fullPath}
                                value={value}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={isSubmitting}
                                isValid={!(error && touch)}
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

const MyForm = () => {
    const [formData, submit] = useForm<Yup.InferType<typeof schema>, MyFormResponse, ValidationError[]>(
        values => schema.validate(values, {abortEarly: false}),
        values => dummyApiCall(values.flavour.favourite, values.email)
    );

    const {errors: initialErrors, touched: initialTouched} = useMemo<InitialFormData<Yup.InferType<typeof schema>>>(() => formData.innerFormErrors && formData.innerFormErrors.reduce(({errors, touched}, {path, message}) => ({
        errors: setIn(errors, path, message),
        touched: setIn(touched, path, true)
    }), {errors: {}, touched: {}}) || {}, [formData.innerFormErrors]);

    const initialValues: Yup.InferType<typeof schema> = {email: "", flavour: {favourite: ""}}//formData.data || (schema as any).getDefault();

    useWhatChanged(MyForm, { formData, submit, initialValues });

    return (
        <>
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
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        handleReset,
                        setFieldTouched,
                        setFieldValue,
                        setFieldError,
                        setStatus,
                        status
                    } = props;
                    useWhatChanged(Formik, { formData, submit, props });
                    return (
                        <Form onSubmit={handleSubmit} method="post">
                            {formData.error && <InputFeedback>There was a problem submitting: {formData.error.message}</InputFeedback>}

                            <Fields
                                fields={schema.fields}
                                values={values}
                                errors={errors}
                                touched={touched}
                                isSubmitting={isSubmitting}
                                setFieldValue={setFieldValue}
                                setFieldTouched={setFieldTouched}
                            />

                            {/*<Section>*/}
                            {/*    <FormLabel label="Flavour" name="flavour.favourite" schema={schema}/>*/}
                            {/*    <Field*/}
                            {/*        as={FancySelect}*/}
                            {/*        id="flavour"*/}
                            {/*        options={options}*/}
                            {/*        name="flavour.favourite"*/}
                            {/*        value={values.flavour.favourite}*/}
                            {/*        onBlur={setFieldTouched}*/}
                            {/*        onChange={setFieldValue}*/}
                            {/*        disabled={isSubmitting}*/}
                            {/*        isValid={!(errors.flavour && errors.flavour.favourite && touched.flavour && touched.flavour.favourite)}*/}
                            {/*        // status={status}*/}
                            {/*        // setFieldError={setFieldError}*/}
                            {/*        // setStatus={setStatus}*/}
                            {/*    />*/}
                            {/*    <ErrorMessage name="flavour.favourite">*/}
                            {/*        {message => <InputFeedback>{message}</InputFeedback>}*/}
                            {/*    </ErrorMessage>*/}
                            {/*</Section>*/}

                            {/*<Section>*/}
                            {/*    <FormLabel label="Email" name="email" schema={schema}/>*/}
                            {/*    <Field*/}
                            {/*        as={Input}*/}
                            {/*        id="email"*/}
                            {/*        name="email"*/}
                            {/*        placeholder="Enter your email"*/}
                            {/*        type="text"*/}
                            {/*        value={values.email}*/}
                            {/*        onChange={handleChange}*/}
                            {/*        onBlur={handleBlur}*/}
                            {/*        disabled={isSubmitting}*/}
                            {/*        isValid={!(errors.email && touched.email)}*/}
                            {/*        // status={status}*/}
                            {/*        // setFieldError={setFieldError}*/}
                            {/*        // setStatus={setStatus}*/}
                            {/*    />*/}
                            {/*    <ErrorMessage name="email">*/}
                            {/*        {message => <InputFeedback>{message}</InputFeedback>}*/}
                            {/*    </ErrorMessage>*/}
                            {/*</Section>*/}

                            <p>
                                <Button
                                    type="button"
                                    className="outline"
                                    onClick={handleReset}
                                    disabled={!dirty || isSubmitting}
                                >
                                    Reset
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    Submit
                                </Button>
                            </p>
                        </Form>
                    );
                }}
            </Formik>
        </>
    )
}

export default React.memo(MyForm)
