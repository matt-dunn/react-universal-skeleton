import React from 'react'
import {Helmet} from 'react-helmet-async'
import styled from "styled-components";
import * as Yup from "yup";
import {ValidationError} from "yup";

import {ResponsiveGrid} from "components/Grid";

import Page from '../../styles/Page'

import Form from "components/Form";
import FieldSet from "components/Form/FieldSet";

import FancySelect from "components/FancySelect";
import {MapDataToAction} from "components/actions/form";

const Title = styled.h2`
    color: #ccc;
`;

const GridItems = styled(ResponsiveGrid("div"))``;

const GridItem = styled.div`
    padding: 0 10px 0 0;
`;

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
            }, 0)
        })
    }
})()

const schema = Yup.object().shape({
    email: Yup.string()
        .label("Email")
        .ensure()
        .meta({
            order: 1,
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
        .shape({
            favourite: Yup.string()
                .label("Flavour")
                .ensure()
                .meta({
                    order: 0,
                    category: "other",
                    Component: FancySelect,
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
            order: 3,
            category: "extra",
            Component: "textarea",
            props: {
                placeholder: "Enter notes",
                type: "text"
            }
        }),
    items: Yup.array(Yup.object()
        .shape({
            name: Yup.string()
                .label("Name")
                .meta({
                    order: 0,
                    category: "set1",
                    props: {
                        placeholder: "Enter name",
                        type: "text"
                    }
                })
                .ensure()
                .required(),
            address: Yup.string()
                .label("Address")
                .meta({
                    order: 1,
                    category: "set2",
                    props: {
                        placeholder: "Enter address",
                        type: "text"
                    }
                })
                .ensure(),
            friends: Yup.array(Yup.object()
                .shape({
                    nickname: Yup.string()
                        .label("Nickname")
                        .meta({
                            order: 0,
                            props: {
                                placeholder: "Enter nickname",
                                type: "text"
                            }
                        })
                        .ensure()
                        .required(),
                })
            )
                .label("Friends")
                .meta({
                    order: 2,
                    itemLabel: "Friend"
                })
                .max(2)
        }))
        .label("People")
        .meta({
            order: 2,
            itemLabel: "Person"
        })
        .ensure()
        .min(1)
        .max(5)
});

type MyFormResponse = {
    chosenFlavour: string;
    yourEmail: string;
}

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

const handleSubmit: MapDataToAction<Yup.InferType<typeof schema>, MyFormResponse> = values => dummyApiCall(values.flavour.favourite, values.email)

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
                    schema={schema}
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
