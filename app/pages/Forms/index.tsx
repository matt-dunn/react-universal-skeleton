import React from 'react'
import {Helmet} from 'react-helmet-async'
import styled from "styled-components";
import * as Yup from "yup";

import Form from "components/Form";
import {MapDataToAction} from "components/actions/form";

import Page from '../../styles/Page'

import {dummyApiCall, MyFormResponse} from "./utils";
import schemaComplex from "./schemas/complex";
import layoutComplex from "./layouts/complex";

const Title = styled.h2`
    color: #ccc;
`;

const handleSubmit: MapDataToAction<Yup.InferType<typeof schemaComplex>, MyFormResponse> = values => dummyApiCall(values.flavour.favourite, values.email);

const Forms = () => {
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
                >
                    {layoutComplex}
                </Form>
            </div>
        </Page>
    )
};

export default Forms
