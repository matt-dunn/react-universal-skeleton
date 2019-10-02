import React from 'react'
import {Helmet} from 'react-helmet-async'
import styled from "styled-components";
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { IStatus } from 'components/state-mutate-with-status/status';

import Page from '../styles/Page'
import {IAppState} from '../reducers';
import * as actions from '../actions';
import {IExampleItemState} from '../reducers/__dummy__/example';
import {IExampleGetList, IExampleGetItem} from "../components/api/__dummy__/example";

export type AboutProps = {
    items: IExampleItemState[];
    item?: IExampleItemState;
    onExampleGetList: IExampleGetList;
    onExampleGetItem: IExampleGetItem;
    $status?: IStatus;
};

const Title = styled.h1`
    color: #ccc;
`;

import {AboveTheFold, ClientOnly} from "components/actions";

import List from "app/components/List";
import Item from "app/components/Item";

const About = ({items, item, onExampleGetList, onExampleGetItem, $status, ...props}: AboutProps) => {
    return (
        <Page>
            <Helmet>
                <title>About Page</title>
                <meta name="description" content="Universal App About Page" />
                <meta name="keywords" content="about,..." />
            </Helmet>
            <Title>
                This is the about page
            </Title>

            <AboveTheFold>
                <List items={items} onExampleGetList={onExampleGetList} $status={$status}/>

                <ClientOnly>
                </ClientOnly>
            </AboveTheFold>

            <div style={{height: "110vh"}}/>

            <Item item={item} onExampleGetItem={onExampleGetItem}/>

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

    const onExampleGetList: IExampleGetList = (): any => dispatch(actions.exampleActions.exampleGetList());
    const onExampleGetItem: IExampleGetItem = (): any => dispatch(actions.exampleActions.exampleGetItem());

    return {
        onExampleGetList,
        onExampleGetItem
    }
};

const container = connect(
    mapStateToProps,
    mapDispatchToProps
)(About);

export default container
