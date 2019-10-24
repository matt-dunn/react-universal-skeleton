import React, {useCallback, useContext, useState, useEffect, ReactEventHandler, FormEvent} from 'react'
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

import useWhatChanged from "components/whatChanged/useWhatChanged";

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

import {FormDataContext, useFormData, FormData} from "components/Form";
import ReactSelect from "react-select";
import useEffectAction from "components/actions/useEffectAction";
import {APIError} from "../../components/api";
import {errorLike} from "../../components/error";

const Form = styled.form`
  display: flex;
  width: 100%;
  font-size: 16px;
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
  margin-left: 8px;
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

const FancySelect = ({options, name, value, onChange}: {options: Option[]; name: string; value?: string; onChange: (value: Option) => void;}) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (isClient) {
        const defaultValue = (value && options.filter(option => option.value ===value)[0]) || options[0];
        return (
            <Select
                name={name}
                defaultValue={defaultValue}
                options={options}
                onChange={onChange}
            />
        )
    } else {
        return (
            <BasicSelect
                className="no-js"
                name={name}
                value={value}
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
}

type MyFormResponse = {
    chosenFlavour: string;
}


const About = ({items, item, onExampleGetList, onExampleGetItem, onExampleEditItem, $status}: AboutProps) => {
    const data = useFormData<MyForm, MyFormResponse>();
    const [formData, setFormData] = useState(data);
    const { page } = useParams();

    const renderListItem = useCallback((item: IExampleItemState) => {
        // return <div>ITEM - {item.name}</div>
        return <AboutListItem item={item} onChange={onExampleEditItem} type="primary" isImportant={importantIds.indexOf(item.id) !== -1}/>
    }, [onExampleEditItem])

    const renderItem = useCallback(({ isVisible }) => <Item isShown={isVisible} item={item} onExampleGetItem={onExampleGetItem}/>, [item, onExampleGetItem])

    const {flavour} = formData.data;

    const isValid = Boolean(formData.isSubmitted && flavour);

    console.log("@@@@@", formData, formData.payload)

    const submit = (formData: FormData) => {
        console.log("@@@@@: CALL API", formData)
        formData.isProcessed = true;
        return new Promise<MyFormResponse>(resolve => {
            if (flavour === "vanilla") {
                // throw new APIError("Authentication Failed", "auth", 403)
                throw new Error("Bumhole!")
            }
            setTimeout(() => {
                resolve({chosenFlavour: `CHOSEN: ${flavour}`});
            }, 2000);
        })
            .then(payload => {
                formData.payload = payload
                return payload
            })
            .catch(ex => {
                formData.error = errorLike(ex);
                throw ex;
            })
    }

    const handleSubmit = (e: FormEvent) => {
        console.log(">>>", formData)

        setFormData(formData => ({...formData, isSubmitted: true, isProcessed: true, error: undefined}))

        submit(formData)
            .then((payload: any) => {
                console.log("END", payload)
                setFormData(formData => ({...formData, payload}))
            })
            .catch(error => {
                setFormData(formData => ({...formData, isSubmitted: false, isProcessed: false, error}))
            })

        e.preventDefault();
    }

    const handleChange = ({value}: Option) => {
        console.log(">>>!!", value)
        setFormData(formData => ({...formData, isSubmitted: false, isProcessed: false, error: undefined, data: {...formData.data, flavour: value}}))
    }

    useEffectAction(
        () => submit(formData),
        () => formData.isSubmitted && !formData.isProcessed && isValid
    );

    useWhatChanged(About, { formData, items, item, onExampleGetList, onExampleGetItem, onExampleEditItem, $status, renderListItem, page});

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

            <AboveTheFold>

                {(isValid && !formData.error) && <p>You submitted '{flavour}'</p>}
                {formData.error && <p>There was a problem submitting</p>}
                {(formData.isSubmitted && !isValid) && <p>Flavour is required</p>}
                <Form method="post" action="">
                    <FancySelect
                        options={options}
                        name="flavour"
                        value={formData.data["flavour"]}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Go
                    </Button>
                </Form>

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
