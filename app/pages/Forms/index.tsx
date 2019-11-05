import React from 'react'
import {Helmet} from 'react-helmet-async'
import styled from "styled-components";
import * as Yup from "yup";

import {ResponsiveGrid} from "components/Grid";
import Form from "components/Form";
import FieldSet from "components/Form/FieldSet";
import {MapDataToAction} from "components/actions/form";

import Page from '../../styles/Page'

import {dummyApiCall, MyFormResponse} from "./utils";
import schemaComplex from "./schemas/complex";

const Title = styled.h2`
    color: #ccc;
`;

const GridItems = styled(ResponsiveGrid("div"))``;

const GridItem = styled.div`
    padding: 0 10px 0 0;
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

            <div style={{maxWidth: "800px"}}>
                <Form
                    schema={schemaComplex}
                    onSubmit={handleSubmit}
                >
                    {({children, extra, other}) => {
                        return (
                            <>
                                <div style={{borderBottom: "1px solid #dfdfdf", margin: "0 0 20px 0", padding: "0 0 10px 0"}}>
                                    <FieldSet
                                        fields={other}
                                    />
                                    <p style={{fontSize: "14px", backgroundColor: "#eee", padding: "10px", borderRadius: "10px", margin: "0 0 10px 0"}}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                                </div>
                                <GridItems minItemWidth={250}>
                                    <GridItem>
                                        <FieldSet
                                            fields={children}
                                        >
                                            {({set1, set2, children}) => {
                                                return (
                                                    <>
                                                        <GridItems minItemWidth={150}>
                                                            <GridItem>
                                                                <FieldSet
                                                                    fields={set1}
                                                                />
                                                            </GridItem>
                                                            <GridItem>
                                                                <FieldSet
                                                                    fields={set2}
                                                                />
                                                            </GridItem>
                                                        </GridItems>
                                                        <FieldSet
                                                            fields={children}
                                                        />
                                                    </>
                                                )
                                            }}
                                        </FieldSet>
                                    </GridItem>
                                    <GridItem>
                                        <p style={{fontSize: "14px", backgroundColor: "#eee", padding: "10px", borderRadius: "10px", margin: "0 0 10px 0"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                        <FieldSet
                                            fields={extra}
                                        />
                                    </GridItem>
                                </GridItems>
                            </>
                        )
                    }}
                </Form>
            </div>
        </Page>
    )
};

export default Forms
