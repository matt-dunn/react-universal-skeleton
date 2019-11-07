import React from 'react'
import {Helmet} from 'react-helmet-async'
import styled from "styled-components";
import * as Yup from "yup";

import {Collections, Form} from "components/Form/index";
import {MapDataToAction} from "components/actions/form";

import Page from '../../styles/Page'

import {dummyApiCall, MyFormResponse} from "./utils";
import schemaComplex from "./schemas/complex";
import layoutComplex from "./layouts/complex";

const Title = styled.h2`
    color: #ccc;
`;

const formState = {
    firstName: "pat",
    lastName: "mustard"
}

const formState2 = {
    age: 34,
    address: "somewhere..."
}

const Forms = () => {
    const handleSubmit: MapDataToAction<Yup.InferType<typeof schemaComplex>, MyFormResponse, any> = values => dummyApiCall(values.flavour.favourite, values.email);

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
                    formId="my-form"
                    schema={schemaComplex}
                    onSubmit={handleSubmit}
                    // onSubmit={(values, context) => {
                    //     console.error("#####SUBMIT-STATE", context.moose)
                    //
                    //     return dummyApiCall(values.flavour.favourite, values.email);
                    // }}
                    context={formState}
                >
                    {(map, metadata) => {
                        // console.log(metadata, metadata.payload && metadata.payload.chosenFlavour)
                        // console.log(metadata, metadata.context && metadata.context.firstName)

                        return (
                            <>
                                {layoutComplex(map)}
                                {metadata.payload && <pre style={{whiteSpace: "normal"}}>{JSON.stringify(metadata.payload)}</pre>}
                            </>
                        )
                    }}
                </Form>

                <Form
                    formId="my-form2"
                    schema={schemaComplex}
                    onSubmit={handleSubmit}
                    context={formState2}
                >
                    {(map, metadata) => {
                        // console.log(metadata, metadata.payload && metadata.payload.chosenFlavour)
                        // console.log(metadata, metadata.context && metadata.context.address)

                        return (
                            <>
                                <Collections map={map}/>
                                {metadata.payload && <pre style={{whiteSpace: "normal"}}>{JSON.stringify(metadata.payload)}</pre>}
                            </>
                        )
                    }}
                </Form>
            </div>
        </Page>
    )
};

export default Forms
