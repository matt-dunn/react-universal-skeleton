import React, {ComponentElement, ComponentType, useMemo} from 'react'
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
    FieldArray, FormikHelpers
} from 'formik';
import * as Yup from 'yup';
import {ValidationError, Schema, InferType, AnySchemaConstructor} from "yup";

import useWhatChanged from "components/whatChanged/useWhatChanged";

import {MapDataToAction, useForm} from "components/actions/form";
import FormLabel from "app/components/Form/Label";
import FancySelect from "app/components/FancySelect";
import immutable from "object-path-immutable";
import {string} from "yup";
import {ObjectSchemaDefinition} from "yup";
import {Ref} from "yup";
import {SchemaDescription} from "yup";

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

const SubSection = styled.fieldset`
  margin: 0 0 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
`

const Legend = styled.legend`
  padding: 2px 20px;
  background-color: #eee;
  border-radius: 1em;
`

// const options = [
//     { value: '', label: 'Select...' },
//     { value: 'chocolate', label: 'Chocolate' },
//     { value: 'strawberry', label: 'Strawberry' },
//     { value: 'vanilla', label: 'Vanilla' },
// ];
//
// type MyFormResponse = {
//     chosenFlavour: string;
//     yourEmail: string;
// }

// const validateEmailApi = (function() {
//     let t: number;
//
//     return (email: string): Promise<boolean | ValidationError> => {
//         console.log("#####VALIDATE EMAIL")
//         clearTimeout(t);
//         return new Promise((resolve, reject) => {
//             if (email === "matt.j.dunn@gmail.com") {
//                 throw new Error("Email validation failed")
//             }
//
//             t = setTimeout(() => {
//                 // reject(new Error("Email validation failed"))
//                 resolve(!email.startsWith("demo@"))
//             }, 1500)
//         })
//     }
// })()

// const schema = Yup.object().shape({
//     email: Yup.string()
//         .label("Email")
//         .ensure()
//         .meta({
//             order: 1,
//             Type: Input,
//             props: {
//                 placeholder: "Enter your email",
//                 type: "text"
//             }
//         })
//         .required('Email is required')
//         .ensure()
//         .email()
//         .test("email", "Email ${value} is unavailable", function(value: string) {
//             if (!value || !Yup.string().email().isValidSync(value)) {
//                 return true;
//             } else {
//                 return validateEmailApi(value)
//                     .catch(reason => new ValidationError(reason.message, value, this.path))
//             }
//         }),
//     flavour: Yup.object()
//         .meta({
//             order: 0
//         })
//         .shape({
//         favourite: Yup.string()
//             .label("Flavour")
//             .ensure()
//             .meta({
//                 order: 1,
//                 Type: FancySelect,
//                 props: {
//                     options: [
//                         { value: '', label: 'Select...' },
//                         { value: 'chocolate', label: 'Chocolate' },
//                         { value: 'strawberry', label: 'Strawberry' },
//                         { value: 'vanilla', label: 'Vanilla' },
//                     ]
//                 }
//             })
//             .required('Flavour is required')
//     }),
//     notes: Yup.string()
//         .required('Notes is required')
//         .label("Notes")
//         .ensure()
//         .meta({
//             order: 2,
//             Type: Textarea,
//             props: {
//                 placeholder: "Enter your notes",
//                 type: "text"
//             }
//         }),
//     items: Yup.array(Yup.object()
//         .shape({
//             name: Yup.string()
//                 .label("Name")
//                 .meta({
//                     order: 0,
//                     Type: Input,
//                     props: {
//                         placeholder: "Enter your name",
//                         type: "text"
//                     }
//                 })
//                 .ensure()
//                 .required(),
//             address: Yup.string()
//                 .label("Address")
//                 .meta({
//                     order: 1,
//                     Type: Input,
//                     props: {
//                         placeholder: "Enter your address",
//                         type: "text"
//                     }
//                 })
//                 .ensure()
//         }))
//         .label("Peeps")
//         .ensure()
//         // .default([{name: "", address: ""}])
//         .min(1)
//         .max(5)
// });

// const dummyApiCall = (flavour: string, email: string): Promise<MyFormResponse> => {
//     console.log("#####CALL API")
//     return new Promise((resolve, reject) => {
//         if (flavour === "vanilla") {
//             // throw new APIError("Authentication Failed", "auth", 403)
//             throw new Error("Don't like VANILLA!!!")
//         }
//
//         setTimeout(() => {
//             resolve({chosenFlavour: `FLAVOUR: ${flavour}`, yourEmail: `EMAIL: ${email}`})
//         }, 2000);
//     })
// };

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

const getDefault = (schema: Schema<any>, path = "") => {
    const pathSchema = Yup.reach(schema, path);

    return ((pathSchema as any)._type === "array" && (Yup.reach(schema, path) as any)._subType.getDefault()) || (pathSchema as any).getDefault()
};

interface Field<T> extends SchemaDescription {
    _meta: {
        Type?: ComponentType<any>;
        props?: any;
        order?: number;
    };
    _type: string;
    _subType: {
        fields: Fields<T>;
    };
    fields: Fields<T>;
    tests: Array<{ name: string; params: object; OPTIONS: {name: string} }>;
}

export type Fields<T> = {
    [field: string]: Schema<T> & Field<T>;
};

type FieldProps<T extends object> = {
    schema: SchemaWithFields<T>;
    fields: Fields<T>;
    values: T;
    errors: FormikErrors<T>;
    touched: FormikTouched<T>;
    isSubmitting: boolean;
    path?: string;
    setFieldValue: (field: keyof T & string, value: any, shouldValidate?: boolean) => void;
    setFieldTouched: (field: keyof T & string, isTouched?: boolean, shouldValidate?: boolean) => void;
}

interface SchemaWithFields<T> extends Schema<T> {
    fields?: Fields<T>;
}

function Fields<T extends object>({schema, fields, values, errors, touched, isSubmitting, path = "", setFieldValue, setFieldTouched}: FieldProps<T>) {
    const handleChange = (e: any, value?: string) => {
        if (e.target) {
            setFieldValue(e.target.name, e.target.value)
        } else {
            setFieldValue(e, value)
        }
    }

    const handleBlur = (e: any) => {
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
                const value: string[] = getIn(values, fullPath)
                const error = getIn(errors, fullPath)
                const touch = getIn(touched, fullPath)

                if (field._type === "array") {
                    const {min, max} = tests.reduce((o: {min: number; max: number | undefined}, test: { name: string; params: any }) => {
                        if (test.name === "min") {
                            o.min = test.params.min;
                        } else if (test.name === "max") {
                            o.max = test.params.max;
                        }
                        return o;
                    }, {min: 0, max: undefined})

                    // console.log(">>!", field.describe(), value, fullPath, min, max, field.default())

                    const itemsCount = (value && value.length) || 0;

                    console.log(field)

                    return (
                        <FieldArray
                            key={fullPath}
                            name={fullPath}
                            render={arrayHelpers => {
                                const AddOption = ((!max || itemsCount < max) && (
                                    <Button
                                        disabled={isSubmitting}
                                        name="@@ADD_ITEM"
                                        value={fullPath}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            arrayHelpers.push(getDefault(schema, fullPath))
                                        }}
                                    >
                                        Add Item
                                    </Button>
                                )) || null;

                                return (
                                    <SubSection>
                                        {label && <Legend>{label}</Legend>}
                                        {typeof error === "string" && <ErrorMessage name={fullPath}>
                                            {message => <InputFeedback>{message}</InputFeedback>}
                                            </ErrorMessage>
                                        }

                                        {value && value.map((value, index) => {
                                            const itemFullPath = `${fullPath}.${index}`;
                                            const RemoveOption = (itemsCount > min && (
                                                <Button
                                                    disabled={isSubmitting}
                                                    name="@@REMOVE_ITEM"
                                                    value={itemFullPath}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        arrayHelpers.remove(index)
                                                    }}
                                                >
                                                    Remove Item
                                                </Button>
                                            )) || null;

                                            const InsertOption = ((!max || itemsCount < max) && (
                                                <Button
                                                    disabled={isSubmitting}
                                                    name="@@INSERT_ITEM"
                                                    value={itemFullPath}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        arrayHelpers.insert(index, getDefault(schema, fullPath))
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
                                                        schema={schema}
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
                            schema={schema}
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
                            label={label} name={fullPath} field={field}
                        />
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

type FormProps<T, P> = {
    schema: SchemaWithFields<T>;
    mapDataToAction: MapDataToAction<any, P>;
}

function MyForm<T, P>({schema, mapDataToAction}: FormProps<T, P>) {
    const [formData, submit] = useForm<Yup.InferType<typeof schema>, P, ValidationError[]>(
        values => schema.validate(values, {abortEarly: false}),
        mapDataToAction,
        (action, data, value) => {
            switch (action) {
                case "add": {
                    return (value && immutable.push(data, value, getDefault(schema, value))) || data;
                }
                case "remove": {
                    return immutable.del(data, value)
                }
                case "insert": {
                    if (value) {
                        const parts = value.split(".");
                        const index = parseInt(parts.slice(-1).join("."), 10);
                        const path = parts.slice(0, -1).join(".");
                        return immutable.insert(data, path, getDefault(schema, value), index)
                    }
                    break;
                }
            }
        }
    );

    const {errors: initialErrors, touched: initialTouched} = useMemo<InitialFormData<Yup.InferType<typeof schema>>>(() => formData.innerFormErrors && formData.innerFormErrors.reduce(({errors, touched}, {path, message}) => ({
        errors: setIn(errors, path, message),
        touched: setIn(touched, path, true)
    }), {errors: {}, touched: {}}) || {}, [formData.innerFormErrors]);

    const initialValues: Yup.InferType<typeof schema> = formData.data || getDefault(schema);

    console.log("@@@", initialValues && initialValues)

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
                        status,
                        isValid,
                        isInitialValid
                    } = props;
                    // console.log("####ERRORS", errors)
                    useWhatChanged(Formik, { formData, submit, props });
                    return (
                        <Form onSubmit={handleSubmit} method="post">
                            {formData.error && <InputFeedback>There was a problem submitting: {formData.error.message}</InputFeedback>}

                            {schema.fields && <Fields
                                schema={schema}
                                fields={schema.fields}
                                values={values}
                                errors={errors}
                                touched={touched}
                                isSubmitting={isSubmitting}
                                setFieldValue={setFieldValue}
                                setFieldTouched={setFieldTouched}
                            />}

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
                                <Button type="submit" disabled={isSubmitting} name="@@SUBMIT">
                                    Submit {(isValid && isInitialValid) && "✔"}
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
