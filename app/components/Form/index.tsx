import React, {useContext, useState, useEffect} from 'react'
import styled, {css} from "styled-components";

import { Formik } from 'formik';
import * as Yup from 'yup';

import useWhatChanged from "components/whatChanged/useWhatChanged";

import {useFormData} from "components/Form";
import ReactSelect from "react-select";
import {errorLike} from "components/error";
import {APIContext} from "components/actions/contexts";


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

const FancySelect = ({id, options, name, value, onChange, onBlur}: {id: string; options: Option[]; name: string; value?: string; onChange: (name: string, value: string) => void; onBlur: (name: string, touched: boolean) => void;}) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleChange = ({value}: {value: string;}) => {
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
        .email()
        .required('Email is required'),
    flavour: Yup.string()
        .required('Flavour is required')
});

const MyForm = () => {
    const formDataContext = useFormData<MyForm, MyFormResponse>();
    const [formData, setFormData] = useState(formDataContext);

    // console.log("@@@@@", formData, formData.payload)

    // const x = React.createRef<Formik>()

    const submit = (data: MyForm): Promise<MyFormResponse> => {
        console.log("@@@@@@CALL FORM API")
        return new Promise((resolve, reject) => {
            if (data.flavour === "vanilla") {
                // throw new APIError("Authentication Failed", "auth", 403)
                throw new Error("Don't like VANILLA!!!")
            }

            setTimeout(() => {
                resolve({chosenFlavour: `FLAVOUR: ${data.flavour}`, yourEmail: `EMAIL: ${data.email}`})
            }, 2000);

        })
    }

    const context = useContext<Promise<any>[] | undefined>(APIContext as any);

    if (context && formDataContext.isSubmitted && !formDataContext.isProcessed) {
        context.push(schema.validate(formDataContext.data, {abortEarly: false})
            .then(data => {
                return submit(data)
                    .then(payload => {
                        formDataContext.payload = payload;
                    })
                    .catch(reason => {
                        formDataContext.error = errorLike(reason);
                        throw reason;
                    })
            })
            .catch(reason => {
                console.log("ERROR@@@@", reason)

                if (reason.inner) {
                    formDataContext.errors = reason.inner.reduce((errors: any, error: any) => {
                        errors[error.path] = error.message;
                        return errors;
                    }, {})
                }
            })
            .finally(() => {
                formDataContext.isProcessed = true;
            })
        );
    }

    // useWhatChanged(About, { formData, items, item, onExampleGetList, onExampleGetItem, onExampleEditItem, $status, renderListItem, page});

    return (
        <div>
            {formData.payload && <pre>{JSON.stringify(formData.payload)}</pre>}

            {formData.error && <InputFeedback>There was a problem submitting: {formData.error.message}</InputFeedback>}

            <Formik
                initialValues={formData.data || { email: '', flavour: '' }}
                onSubmit={(values, { setSubmitting }) => {
                    submit(values as any)
                        .then(payload => {
                            setFormData(formData => ({...formData, isProcessed: true, error: undefined, payload: payload, data: values as any}))
                        })
                        .catch(reason => {
                            setFormData(formData => ({...formData, isProcessed: true, error: reason, payload: undefined, data: values as any}))
                        })
                        .finally(() => {
                            setSubmitting(false);
                        })
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
