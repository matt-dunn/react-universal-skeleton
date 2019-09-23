import React, {useEffect} from 'react'
import {Helmet} from 'react-helmet-async'

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import Page from '../components/Page.jsx'
import styled from "styled-components";

import {IAppState} from '../reducers';
// import {IExampleList, IExampleResponse} from '../components/api/__dummy__/example';

import * as actions from '../actions';

import {IExampleItemState, IExampleListState} from '../reducers/__dummy__/example';
// import {IExampleAction} from '../container';
import Status, { IStatus } from '../components/state-mutate-with-status/status';
import {IExampleGetList} from "../components/api/__dummy__/example";

const Title = styled.div`
    color: blue;
    font-size: 50px;
`

export type IInjectedAboutProps = {
    items: IExampleListState;
    item?: IExampleItemState;
    onExampleGetList: IExampleGetList;
    $status?: IStatus;
};

export type IAboutProps = { testString: string; testNumber: number; } & IInjectedAboutProps;

const About = ({items, item, onExampleGetList, $status, ...props}: IAboutProps) => {
    // console.error("ABOUT", items.toJS(), item.toJS())
    console.log("PROPS", items, props)
    console.log("STATUS", Status($status))
    const status = Status($status);

    useEffect(() => {
        onExampleGetList()
    }, []);

    return (
        <Page>
            <Helmet>
                <title>About Page</title>
            </Helmet>
            <Title>
                This is the about page
            </Title>
            [{status.processing ? "Processing" : "Done"}]

            {(!status.complete && items.length === 0 && (!status.isActive || status.processing)) &&
                <div>
                    LIST PLACEHOLDER...
                </div>
            }
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        {item.name}
                    </li>
                ))}
            </ul>
        </Page>
    )
}

// export type IExampleAction = (id: string, name: string) => Promise<IExampleResponse>;

const mapStateToProps = (state: IAppState) => {
    const item = state.example.item;
    const items = state.example.items;
    const $status = state.example.$status;
    return { item, items, $status }
};

const mapDispatchToProps = (dispatch: Dispatch<actions.RootActions>) => {

    const onExampleGetList: IExampleGetList = (): any => dispatch(actions.exampleActions.exampleGetList());

    return {
        onExampleGetList
    }
};

const container = connect(
    mapStateToProps,
    mapDispatchToProps
)(About);

export default container
