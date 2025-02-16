import React from "react";
import {Helmet} from "react-helmet-async";
import styled from "@emotion/styled";
import * as Yup from "yup";

import {Collections, Form} from "components/Form/index";
import {MapDataToAction} from "components/actions/form";

import {Main, Title} from "app/styles/Components";

import {dummyApiCall, MyFormResponse} from "./utils";
import schemaComplex from "./schemas/complex";
import ComplexLayout from "./layouts/Complex";

import {FormContainer} from "components/Form";
import {FormOptions} from "components/Form/FormOptions";
import {ValidationError} from "yup";
import {FormattedMessage} from "react-intl";

// import {useFormikContext} from "formik";
// import {formStyles} from "../../../components/Form/styles";

const SubmissionFeedback = styled.section`
  padding: 20px 10px 10px 10px;
  background-color: orange;
  border-radius: 4px;
  
  pre {
    border: 1px solid #999;
    background-color: #eee;
    padding: 5px;
  }
`;

const formState = {
    firstName: "pat",
    lastName: "mustard"
};

type X = {
    age: number;
    address: string;
    moose?: boolean;
}

const formState2: X = {
    age: 34,
    address: "somewhere..."
};

const simpleSchema = Yup.object().shape({
    username: Yup.string()
        .label("Username")
        .required()
        .ensure(),
    password: Yup.object().shape({
        secret: Yup.string()
            .label("Password")
            .required()
            .ensure()
            .meta({
                props: {
                    type: "password"
                }
            })
    })
});

export type MySimpleFormResponse = {
    newUsername: string;
}

const SimpleFormContainer = styled(FormContainer)`
  border: 1px solid #ccc;
  padding: 15px 30px;
  background-color: inherit;
  border-radius: 3px;
  margin: 0 0 20px 0;
`;

const MyFormContainer = styled(SimpleFormContainer)`
  border-width: 4px;
  border-radius: 15px;
`;

const Forms = () => {
    const handleSubmit: MapDataToAction<Yup.InferType<typeof schemaComplex>, MyFormResponse, typeof formState> = values => dummyApiCall(values.flavour.favourite, values.email);
    const handleSubmit2: MapDataToAction<Yup.InferType<typeof simpleSchema>, MySimpleFormResponse, typeof formState2> = values => {
        if (values.username.toLowerCase() === "clem") {
            throw new ValidationError("Invalid password", "", "password.secret");
        } else if (values.username.toLowerCase() === "pat") {
            throw new Error("Incorrect details");
        }
        return Promise.resolve({newUsername: values.username});
    };

    return (
        <Main>
            <Helmet>
                <title>Forms</title>
            </Helmet>
            <Title>
                <FormattedMessage
                    key="title"
                    defaultMessage="Forms (Lazy Loaded)"
                />
            </Title>

            <div style={{maxWidth: "50em", margin: "0 auto"}}>
                <Form
                    id="my-form"
                    as={MyFormContainer}
                    schema={schemaComplex}
                    // onSubmit={function(values, context) {
                    //     const z = context && context.lastName
                    //     return dummyApiCall(values.flavour.favourite, values.email);
                    // } as MapDataToAction<Yup.InferType<typeof schemaComplex>, MyFormResponse, typeof formState>}
                    onSubmit={handleSubmit}
                    context={formState}
                    complete={({values, metadata}) => (
                        <SubmissionFeedback>
                            The form has been submitted.

                            <pre style={{whiteSpace: "normal", overflowWrap: "break-word"}}>values: {JSON.stringify(values)}</pre>
                            <pre style={{whiteSpace: "normal", overflowWrap: "break-word"}}>metadata: {JSON.stringify(metadata)}</pre>
                        </SubmissionFeedback>
                    )}
                >
                    {ComplexLayout}
                </Form>

                <Form
                    id="my-form2"
                    as={SimpleFormContainer}
                    schema={schemaComplex}
                    onSubmit={handleSubmit}
                    context={formState}
                    complete={
                        ({values, metadata}) => {
                            return (
                                <SubmissionFeedback>
                                    The form has been submitted.

                                    <pre style={{whiteSpace: "normal", overflowWrap: "break-word"}}>values: {JSON.stringify(values)}</pre>
                                    <pre style={{whiteSpace: "normal", overflowWrap: "break-word"}}>metadata: {JSON.stringify(metadata)}</pre>
                                </SubmissionFeedback>
                            );
                        }
                    }
                >
                    {({fieldsetMap, metadata}) => {
                        // console.log(metadata, metadata.payload && metadata.payload.chosenFlavour)
                        // console.log(metadata, metadata.context && metadata.context.address)

                        return (
                            <>
                                <Collections fieldsetMap={fieldsetMap}/>
                                {metadata.payload && <pre style={{whiteSpace: "normal", overflowWrap: "break-word"}}>{JSON.stringify(metadata.payload)}</pre>}
                                <FormOptions/>
                            </>
                        );
                    }}
                </Form>

                <Form
                    id="my-form3"
                    as={SimpleFormContainer}
                    schema={simpleSchema}
                    onSubmit={handleSubmit2}
                    context={formState2}
                    complete={
                        ({values, metadata}) => {
                            return (
                                <SubmissionFeedback>
                                    The form has been submitted.

                                    <pre style={{whiteSpace: "normal", overflowWrap: "break-word"}}>values: {JSON.stringify(values)}</pre>
                                    <pre style={{whiteSpace: "normal", overflowWrap: "break-word"}}>metadata: {JSON.stringify(metadata)}</pre>
                                </SubmissionFeedback>
                            );
                        }
                    }
                />
            </div>
        </Main>
    );
};

export default Forms;
