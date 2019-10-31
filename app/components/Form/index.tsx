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
    FormikErrors,
    FormikTouched
} from 'formik';
import * as Yup from 'yup';
import {ValidationError} from "yup";

import useWhatChanged from "components/whatChanged/useWhatChanged";

import {useForm} from "components/actions/form";
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

const Label = styled.label`
  color: #666;
  margin: 2px 0;
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

type MyForm = {
    flavour: string;
    email: string;
}

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
    flavour: Yup.string()
        .required('Flavour is required')
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

const MyForm = () => {
    const [formData, submit] = useForm<MyForm, MyFormResponse, ValidationError[]>(
        values => schema.validate(values, {abortEarly: false}),
        values => dummyApiCall(values.flavour, values.email)
    );

    const {errors: initialErrors, touched: initialTouched} = useMemo<InitialFormData<MyForm>>(() => formData.innerFormErrors && formData.innerFormErrors.reduce(({errors, touched}, {path, message}) => ({
        errors: setIn(errors, path, message),
        touched: setIn(touched, path, true)
    }), {errors: {}, touched: {}}) || {}, [formData.innerFormErrors]);

    const initialValues = formData.data || { email: '', flavour: '' };

    useWhatChanged(MyForm, { formData, submit });

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

                            <Section>
                                <Label htmlFor="flavour" style={{ display: 'block' }}>
                                    Flavour
                                </Label>
                                <Field
                                    as={FancySelect}
                                    id="flavour"
                                    options={options}
                                    name="flavour"
                                    value={values.flavour}
                                    onBlur={setFieldTouched}
                                    onChange={setFieldValue}
                                    disabled={isSubmitting}
                                    isValid={!(errors.flavour && touched.flavour)}
                                    // status={status}
                                    // setFieldError={setFieldError}
                                    // setStatus={setStatus}
                                />
                                <ErrorMessage name="flavour">
                                    {message => <InputFeedback>{message}</InputFeedback>}
                                </ErrorMessage>
                            </Section>

                            <Section>
                                <Label htmlFor="email" style={{ display: 'block' }}>
                                    Email
                                </Label>
                                <Field
                                    as={Input}
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    type="text"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                    isValid={!(errors.email && touched.email)}
                                    // status={status}
                                    // setFieldError={setFieldError}
                                    // setStatus={setStatus}
                                />
                                <ErrorMessage name="email">
                                    {message => <InputFeedback>{message}</InputFeedback>}
                                </ErrorMessage>
                            </Section>

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
