import React from 'react'
import {Helmet} from 'react-helmet-async'
import styled from "styled-components";
import * as Yup from "yup";

import {Collections, Form} from "components/Form/index";
import {MapDataToAction} from "components/actions/form";

import Page from '../../styles/Page'

import {dummyApiCall, MyFormResponse} from "./utils";
import schemaComplex from "./schemas/complex";
import ComplexLayout from "./layouts/Complex";

const Title = styled.h2`
    color: #ccc;
`;

const SubmissionFeedback = styled.section`
  padding: 20px 10px 10px 10px;
  background-color: orange;
  border-radius: 4px;
  
  pre {
    border: 1px solid #999;
    background-color: #eee;
    padding: 5px;
  }
`

const formState = {
    firstName: "pat",
    lastName: "mustard"
}

type X = {
    age: number;
    address: string;
    moose?: boolean;
}

const formState2:X = {
    age: 34,
    address: "somewhere..."
}

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
})

export type MySimpleFormResponse = {
    newUsername: string;
}

const Forms = () => {
    const handleSubmit: MapDataToAction<Yup.InferType<typeof schemaComplex>, MyFormResponse, any> = values => dummyApiCall(values.flavour.favourite, values.email);
    const handleSubmit2: MapDataToAction<Yup.InferType<typeof simpleSchema>, MySimpleFormResponse, any> = values => Promise.resolve({newUsername: values.username});

    return (
        <Page>
            <Helmet>
                <title>Forms</title>
                <meta name="description" content="Universal App Form Page" />
                <meta name="keywords" content="forms,..." />
            </Helmet>
            <Title>
                Forms (Lazy Loaded)
            </Title>

            <div style={{maxWidth: "800px", margin: "0 auto"}}>
                <Form
                    id="my-form"
                    schema={schemaComplex}
                    onSubmit={handleSubmit}
                    // onSubmit={(values, context) => {
                    //     console.error("#####SUBMIT-STATE", context.moose)
                    //
                    //     return dummyApiCall(values.flavour.favourite, values.email);
                    // }}
                    context={formState}
                >
                    {({fieldsetMap, metadata}) => {
                        // console.log(metadata, metadata.payload && metadata.payload.chosenFlavour)
                        // console.log(metadata, metadata.context && metadata.context.firstName)

                        return (
                            <>
                                <ComplexLayout fieldsetMap={fieldsetMap}/>
                                {metadata.payload && <pre style={{whiteSpace: "normal"}}>{JSON.stringify(metadata.payload)}</pre>}
                            </>
                        )
                    }}
                </Form>

                <Form
                    id="my-form2"
                    schema={schemaComplex}
                    onSubmit={handleSubmit}
                    context={formState2}
                    complete={
                        ({values, metadata}) => {
                            return (
                                <SubmissionFeedback>
                                    The form has been submitted.

                                    <pre style={{whiteSpace: "normal"}}>values: {JSON.stringify(values)}</pre>
                                    <pre style={{whiteSpace: "normal"}}>metadata: {JSON.stringify(metadata)}</pre>
                                </SubmissionFeedback>
                            )
                        }
                    }
                >
                    {({fieldsetMap, metadata, ...props}) => {
                        console.log("???", props)
                        // console.log(metadata, metadata.payload && metadata.payload.chosenFlavour)
                        // console.log(metadata, metadata.context && metadata.context.address)

                        return (
                            <>
                                <Collections fieldsetMap={fieldsetMap}/>
                                {metadata.payload && <pre style={{whiteSpace: "normal"}}>{JSON.stringify(metadata.payload)}</pre>}
                            </>
                        )
                    }}
                </Form>

                <Form
                    id="my-form3"
                    schema={simpleSchema}
                    onSubmit={handleSubmit2}
                    context={formState2}
                    complete={
                        ({values, metadata}) => {
                            return (
                                <SubmissionFeedback>
                                    The form has been submitted.

                                    <pre style={{whiteSpace: "normal"}}>values: {JSON.stringify(values)}</pre>
                                    <pre style={{whiteSpace: "normal"}}>metadata: {JSON.stringify(metadata.context && metadata.context.moose)}</pre>
                                </SubmissionFeedback>
                            )
                        }
                    }
                />
            </div>
        </Page>
    )
};

export default Forms
