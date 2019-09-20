import React from 'react'
import {Helmet} from 'react-helmet-async'

import { connect } from 'react-redux';

import Page from '../components/Page.jsx'
import styled from "styled-components";

const Load = styled.div`
    color: blue;
    font-size: 50px;
`

const About = () => (
    <Page>
        <Helmet>
            <title>About Page</title>
        </Helmet>
        <Load>
            This is the about page!!!
        </Load>
    </Page>
)

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
