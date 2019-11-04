import React, {useCallback} from 'react'
import {Helmet} from 'react-helmet-async'
import styled, {css} from "styled-components";
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import TrackVisibility from 'react-on-screen';
import { useParams} from "react-router";

import { IStatus } from 'components/state-mutate-with-status/status';
import {AboveTheFold, ClientOnly} from "components/actions";
import List from "app/components/List";
import Item from "app/components/Item";
import EditItem from "app/components/EditItem";

import Page from '../styles/Page'
import * as actions from '../actions';
import {IAppState} from '../reducers';
import {IExampleItemState} from '../reducers/__dummy__/example';
import {IExampleGetList, IExampleGetItem, ExampleEditItem} from "../components/api/__dummy__/example";

import MyForm from "components/Form";

import useWhatChanged from "components/whatChanged/useWhatChanged";
import * as Yup from "yup";
import {string} from "yup";
import {ValidationError} from "yup";
import FancySelect from "components/FancySelect";
import {MapDataToAction} from "components/actions/form";

export type AboutProps = {
    items: IExampleItemState[];
    item?: IExampleItemState;
    onExampleGetList: IExampleGetList;
    onExampleGetItem: IExampleGetItem;
    onExampleEditItem: ExampleEditItem;
    $status?: IStatus;
};

const Title = styled.h2`
    color: #ccc;
`;

const AboutItem = styled(EditItem)`
  margin: 50px auto;
  max-width: 300px;
`

const AboutListItem = styled(EditItem)<{isImportant?: boolean}>`
  ${({isImportant}) => isImportant && css`background-color: rgba(230, 230, 230, 0.5);`}
`

const importantIds = ["item-1", "item-2"]

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
        .meta({
            order: 0
        })
        .shape({
            favourite: Yup.string()
                .label("Flavour")
                .ensure()
                .meta({
                    order: 1,
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
            Component: "textarea",
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
                    props: {
                        placeholder: "Enter your address",
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
        .label("Peeps")
        .meta({
            order: 2,
            itemLabel: "Peep"
        })
        .ensure()
        // .default([{name: "", address: ""}])
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

const About = ({items, item, onExampleGetList, onExampleGetItem, onExampleEditItem, $status}: AboutProps) => {
    const { page } = useParams();

    const renderListItem = useCallback((item: IExampleItemState) => {
        // return <div>ITEM - {item.name}</div>
        return <AboutListItem item={item} onChange={onExampleEditItem} type="primary" isImportant={importantIds.indexOf(item.id) !== -1}/>
    }, [onExampleEditItem])

    const renderItem = useCallback(({ isVisible }) => <Item isShown={isVisible} item={item} onExampleGetItem={onExampleGetItem}/>, [item, onExampleGetItem])

    useWhatChanged(About, { items, item, onExampleGetList, onExampleGetItem, onExampleEditItem, $status, renderListItem, page});

    return (
        <Page>
            <Helmet>
                <title>About Page</title>
                <meta name="description" content="Universal App About Page" />
                <meta name="keywords" content="about,..." />
            </Helmet>
            <Title>
                About page (Lazy Loaded)
            </Title>

            <MyForm
                schema={schema}
                onSubmit={handleSubmit}
            />

            <AboveTheFold>
                {/*<List items={items} onExampleGetList={onExampleGetList} onExampleEditItem={onExampleEditItem} activePage={parseInt(page || "0", 10)}>*/}
                {/*    /!*{(item: IExampleItemState) => {*!/*/}
                {/*    /!*    return <div>ITEM - {item.name}</div>*!/*/}
                {/*    /!*}}*!/*/}
                {/*</List>*/}
                {/*<TrackVisibility once={true} partialVisibility={true}>*/}
                {/*    {({ isVisible }) => <List isShown={isVisible} items={items} onExampleGetList={onExampleGetList} onExampleEditItem={onExampleEditItem}/>}*/}
                {/*</TrackVisibility>*/}

                <List items={items} onExampleGetList={onExampleGetList} onExampleEditItem={onExampleEditItem} activePage={parseInt(page || "0", 10)}>
                    {renderListItem}
                </List>

                <ClientOnly>
                </ClientOnly>
            </AboveTheFold>

            {/*<TrackVisibility once={true} partialVisibility={true}>*/}
            {/*    {({ isVisible }) =>*/}
            {/*        <List isShown={isVisible} items={items} onExampleGetList={onExampleGetList} onExampleEditItem={onExampleEditItem} activePage={parseInt(page || "0", 10)}>*/}
            {/*            {renderListItem}*/}
            {/*        </List>*/}
            {/*    }*/}
            {/*</TrackVisibility>*/}

            {/*<TrackVisibility once={true} partialVisibility={true}>*/}
            {/*    {({ isVisible }) => items && items[0] && items[0].id && <EditItem item={items[0]} onChange={onExampleEditItem}/>}*/}
            {/*</TrackVisibility>*/}

            {items && items[0] && items[0].id && <AboutItem item={items[0]} onChange={onExampleEditItem}/>}

            <div style={{height: "110vh"}}/>

            <TrackVisibility once={true} partialVisibility={true}>
                {renderItem}
            </TrackVisibility>

            <p>END.</p>
        </Page>
    )
}

const mapStateToProps = (state: IAppState) => {
    const item = state.example.item;
    const items = state.example.items;
    const $status = state.example.$status;
    return { item, items, $status }
};

const mapDispatchToProps = (dispatch: Dispatch<actions.RootActions>) => {

    const onExampleGetList: IExampleGetList = (page, count): any => dispatch(actions.exampleActions.exampleGetList({page, count}));
    const onExampleGetItem: IExampleGetItem = (): any => dispatch(actions.exampleActions.exampleGetItem());
    const onExampleEditItem: ExampleEditItem = (item: IExampleItemState): any => dispatch(actions.exampleActions.exampleEditItem(item));

    return {
        onExampleGetList,
        onExampleGetItem,
        onExampleEditItem
    }
};

const container = connect(
    mapStateToProps,
    mapDispatchToProps
)(About);

export default container
