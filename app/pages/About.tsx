import React from 'react'
import {Helmet} from 'react-helmet-async'

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import Page from '../components/Page.jsx'
import styled from "styled-components";

import {IAppState} from '../reducers';
import { IExampleResponse } from '../components/api/__dummy__/example';

import * as actions from '../actions';

import {IExampleItemState, IExampleListState} from '../reducers/__dummy__/example';
// import {IExampleAction} from '../container';
import { IStatus } from '../components/state-mutate-with-status/status';

const Title = styled.div`
    color: blue;
    font-size: 50px;
`

export type IInjectedAboutProps = {
    items: IExampleListState;
    item: IExampleItemState;
    onExampleAction: IExampleAction;
    onExampleListAction: IExampleAction;
    $status: IStatus;
};

export type IAboutProps = { testString: string; testNumber: number; } & IInjectedAboutProps;

const About = ({items, item}: IAboutProps) => {
    // console.error("ABOUT", items.toJS(), item.toJS())
    return (
        <Page>
            <Helmet>
                <title>About Page</title>
            </Helmet>
            <Title>
                This is the about page
            </Title>
            <ul>
                {items.map(item => (
                    <li key={item.get("id")}>
                        {item.get("name")}
                    </li>
                ))}
            </ul>
        </Page>
    )
}

export type IExampleAction = (id: string, name: string) => Promise<IExampleResponse>;

const mapStateToProps = (state: IAppState) => {
    const item = state.example.get('item');
    const items = state.example.get('items');
    const $status = state.example.get('$status');
    return { item, items, $status }
};

const mapDispatchToProps = (dispatch: Dispatch<actions.RootActions>) => {

    const onExampleAction: IExampleAction = (id: string, name: string): any => dispatch(actions.exampleActions.example({ name, id }));

    const onExampleListAction: IExampleAction = (id: string, name: string): any => dispatch(actions.exampleActions.exampleList({ name, id }, { username: 'test' }));

    return {
        onExampleAction,
        onExampleListAction
    }
};

const container = connect(
    mapStateToProps,
    mapDispatchToProps
)(About);

export default container
