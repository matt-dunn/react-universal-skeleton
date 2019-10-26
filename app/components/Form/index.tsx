import React, {useContext, useState, useEffect} from 'react'
import styled, {css} from "styled-components";

import { Formik } from 'formik';
import * as Yup from 'yup';

import useWhatChanged from "components/whatChanged/useWhatChanged";

import {useForm} from "components/actions/form";
import ReactSelect from "react-select";

const Form = styled.form`
  border: 1px solid #ccc;
  background-color: #fdfdfd;
  border-radius: 4px;
  padding: 10px;
  margin: 20px 0;
`;

const SelectStyle = css`
  font-size: inherit;
  height: 36px;
  background-color: transparent;
  flex-grow: 1;
  border-color: rgb(204, 204, 204);
`
const BasicSelect = styled.select`
  ${SelectStyle}
`;
const Select = styled(ReactSelect)`
  ${SelectStyle}
`
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

type Option = {
    value: string;
    label: string;
}

const FancySelect = ({id, disabled, options, name, value, onChange, onBlur}: {id: string; disabled?: boolean; options: Option[]; name: string; value?: string; onChange: (name: string, value: string) => void; onBlur: (name: string, touched: boolean) => void}) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleChange = ({value}: {value: string}) => {
        // this is going to call setFieldValue and manually update values.topcis
        onChange(name, value);
    };

    const handleBlur = () => {
        onBlur(name, true);
    };

    const handleSelectChange = () => {

    }

    if (isClient) {
        const defaultValue = (value && options.filter(option => option.value ===value)[0]) || options[0];
        return (
            <Select
                id={id}
                name={name}
                value={defaultValue}
                options={options}
                onChange={handleChange}
                onBlur={handleBlur}
                isDisabled={disabled}
            />
        )
    } else {
        return (
            <BasicSelect
                id={id}
                className="no-js"
                name={name}
                value={value}
                onChange={handleSelectChange}
                disabled={disabled}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </BasicSelect>
        )
    }
}

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
}

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
                                {((formData.errors && formData.errors.flavour && !touched.flavour) || (errors.flavour && touched.flavour)) && (
                                    <InputFeedback>{errors.flavour || formData.errors.flavour}</InputFeedback>
                                )}
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
                                {((formData.errors && formData.errors.email && !touched.email) || (errors.email && touched.email)) && (
                                    <InputFeedback>{errors.email || formData.errors.email}</InputFeedback>
                                )}
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
