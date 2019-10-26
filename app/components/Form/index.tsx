import React from 'react'
import styled from "styled-components";

import { Formik, getIn, FormikContext, connect } from 'formik';
import * as Yup from 'yup';

import useWhatChanged from "components/whatChanged/useWhatChanged";

import {useForm, useFormData} from "components/actions/form";
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

const Input = styled.input`
  && {
  font-size: inherit;
  border: 1px solid rgb(204, 204, 204);
  padding: 9px 8px;
  border-radius: 4px;
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

const schema = Yup.object().shape({
    email: Yup.string()
        .required('Email is required')
        .email()
        .test("c", "Email ${value} is unavailable", (value: string) => {
            if (!value || !Yup.string().email().isValidSync(value)) {
                return true;
            } else {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(value !== "demo@ixxus.co.uk")
                    }, 1500)
                })
            }
        }),
    flavour: Yup.string()
        .required('Flavour is required')
});

const dummyApiCall = (flavour: string, email: string): Promise<MyFormResponse> => {
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

type FormikProps = {
    formik: FormikContext<{}>;
}

export interface ErrorMessageProps {
    name: string;
    children: (message: string) => JSX.Element;
}

export const ErrorMessage = connect(({name, formik, children}: ErrorMessageProps & FormikProps) => {
    const formData = useFormData();
    const error = getIn(formik.errors, name);
    const touched = getIn(formik.touched, name);

    return (((formData.errors && formData.errors[name] && !touched) || (error && touched)) && children(error || formData.errors[name])) || null;
}) as React.FunctionComponent<ErrorMessageProps>;

const MyForm = () => {
    const [formData, submit] = useForm<MyForm, MyFormResponse>(
        schema,
        values => dummyApiCall(values.flavour, values.email)
    );

    // TODO: set the correct Formik internal state somehow so that when rendered from server resetting a value runs the validator (touch?)
    // const form = React.createRef<Formik>()
    //
    // useEffect(() => {
    //     if (!context && formData.isSubmitted && form.current && formData.data) {
    //         console.log("@@@@@@@@@SUBMIT!!!!!!!")
    //         form.current.runValidations()//.executeSubmit()//.validateForm(formData.data)
    //     }
    // }, [])

    // useWhatChanged(About, { formData, items, item, onExampleGetList, onExampleGetItem, onExampleEditItem, $status, renderListItem, page});

    return (
        <div>
            {formData.payload && <pre>{JSON.stringify(formData.payload)}</pre>}

            <Formik
                initialValues={formData.data || { email: '', flavour: '' }}
                onSubmit={(values, { setSubmitting }) => {
                    submit(values)
                        .finally(() => setSubmitting(false))
                }}
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
                        setFieldValue
                    } = props;
                    return (
                        <Form onSubmit={handleSubmit} method="post">
                            {formData.error && <InputFeedback>There was a problem submitting: {formData.error.message}</InputFeedback>}

                            <Section>
                                <Label htmlFor="flavour" style={{ display: 'block' }}>
                                    Flavour
                                </Label>
                                <FancySelect
                                    id="flavour"
                                    options={options}
                                    name="flavour"
                                    value={values.flavour}
                                    onBlur={setFieldTouched}
                                    onChange={setFieldValue}
                                    disabled={isSubmitting}
                                />
                                <ErrorMessage name="flavour">
                                    {message => <InputFeedback>{message}</InputFeedback>}
                                </ErrorMessage>
                            </Section>

                            <Section>
                                <Label htmlFor="email" style={{ display: 'block' }}>
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    type="text"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                    className={
                                        errors.email && touched.email ? 'text-input error' : 'text-input'
                                    }
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
        </div>
    )
}

export default MyForm
