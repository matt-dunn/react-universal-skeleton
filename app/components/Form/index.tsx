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
    FormikTouched,
    FieldArray
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
const Textarea = styled.textarea<{isValid?: boolean}>`
  && {
  font-size: inherit;
  border: 1px solid rgb(204, 204, 204);
  padding: 9px 8px;
  border-radius: 4px;
  min-width: 100%;
  min-height: 10em;
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

const SubSection = styled.div`
  margin: 0 0 10px 0;
  padding: 10px;
  border: 1px solid #eee;
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
        .ensure()
        .meta({
            order: 1,
            Type: Input,
            props: {
                placeholder: "Enter your email",
                type: "text"
            }
        })
        .required('Email is required')
        .ensure()
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
            order: 0
        })
        .shape({
        favourite: Yup.string()
            .label("Flavour")
            .ensure()
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
    }),
    notes: Yup.string()
        .required('Notes is required')
        .label("Notes")
        .ensure()
        .meta({
            order: 2,
            Type: Textarea,
            props: {
                placeholder: "Enter your notes",
                type: "text"
            }
        }),
    items: Yup.array(Yup.object()
        .shape({
            name: Yup.string()
                .label("Name")
                .meta({
                    order: 0,
                    Type: Input,
                    props: {
                        placeholder: "Enter your name",
                        type: "text"
                    }
                })
                .ensure()
                .required(),
            address: Yup.string()
                .label("Address")
                .meta({
                    order: 1,
                    Type: Input,
                    props: {
                        placeholder: "Enter your address",
                        type: "text"
                    }
                })
                .ensure()
        }))
        // .ensure()
        .default([{name: "", address: ""}, {name: "", address: ""}])
        .min(1)
        .max(4)
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
            {Object.keys(fields).sort((a, b) => ((fields[a]._meta || {}).order || 0) - ((fields[b]._meta || {}).order || 0)).map(key => {
                const field = fields[key];
                const fullPath = [path, key].filter(part => part).join(".");
                // console.log(">>>", fullPath)

                const {type, label, meta, tests} = field.describe();
                const {Type, props} = field._meta || {};
                const value = getIn(values, fullPath)
                const error = getIn(errors, fullPath)
                const touch = getIn(touched, fullPath)

                if (field._type === "array") {

                    const {min, max} = tests.reduce((o, test) => {
                        if (test.name === "min") {
                            o.min = test.params.min;
                        } else if (test.name === "max") {
                            o.max = test.params.max;
                        }
                        return o;
                    }, {min: undefined, max: undefined})

                    console.log(">>!", field.describe(), value, fullPath, min, max, field.default())

                    const itemsCount = value.length;

                    return (
                        <FieldArray
                            key={fullPath}
                            name={fullPath}
                            render={arrayHelpers => {
                                const AddOption = (itemsCount < max && (
                                    <Button
                                        disabled={isSubmitting}
                                        name="ADD_ITEM"
                                        value={fullPath}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            arrayHelpers.push(field.default()[0])
                                        }}
                                    >
                                        Add Item
                                    </Button>
                                )) || null;

                                return (
                                    <SubSection>
                                        {value.map((value, index) => {
                                            const itemFullPath = `${fullPath}.${index}`;
                                            const RemoveOption = (itemsCount > min && (
                                                <Button
                                                    disabled={isSubmitting}
                                                    name="REMOVE_ITEM"
                                                    value={itemFullPath}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        arrayHelpers.remove(index)
                                                    }}
                                                >
                                                    Remove Item
                                                </Button>
                                            )) || null;

                                            const InsertOption = (itemsCount < max && (
                                                <Button
                                                    disabled={isSubmitting}
                                                    name="INSERT_ITEM"
                                                    value={itemFullPath}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        arrayHelpers.insert(index + 1, field.default()[0])
                                                    }}
                                                >
                                                    Insert Item
                                                </Button>
                                            )) || null;

                                            return (
                                                <SubSection
                                                    key={itemFullPath}
                                                >
                                                    <Fields
                                                        fields={field._subType.fields}
                                                        values={values}
                                                        errors={errors}
                                                        touched={touched}
                                                        setFieldValue={setFieldValue}
                                                        setFieldTouched={setFieldTouched}
                                                        isSubmitting={isSubmitting}
                                                        path={itemFullPath}
                                                    />
                                                    {InsertOption}
                                                    {RemoveOption}
                                                </SubSection>
                                            );
                                        })}
                                        {AddOption}
                                    </SubSection>
                                )}}
                        />
                    )
                } else if (field._type === "object") {
                    return (
                        <Fields
                            key={fullPath}
                            fields={field.fields}
                            values={values}
                            errors={errors}
                            touched={touched}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            isSubmitting={isSubmitting}
                            path={fullPath}
                        />
                    )
                }

                return (
                    <Section
                        key={fullPath}
                    >
                        <FormLabel
                            label={label} name={fullPath} field={field}/>
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

    const initialValues: Yup.InferType<typeof schema> = formData.data || (schema as any).getDefault();
    console.log("@@@INITIAL", initialValues)

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
                    console.log("####ERRORS", errors)
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
                                <Button type="submit" disabled={isSubmitting} name="SUBMIT">
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
