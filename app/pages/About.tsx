import React, {useEffect, useState, useRef} from 'react'
import {Helmet} from 'react-helmet-async'

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import Page from '../components/Page.jsx'
import styled, {css} from "styled-components";

import {IAppState} from '../reducers';
// import {IExampleList, IExampleResponse} from '../components/api/__dummy__/example';

import * as actions from '../actions';

import {IExampleItemState, IExampleListState} from '../reducers/__dummy__/example';
// import {IExampleAction} from '../container';
import Status, { IStatus } from '../components/state-mutate-with-status/status';
import {IExampleGetList} from "../components/api/__dummy__/example";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;
import {number} from "prop-types";

const Container = styled.div`
    position: relative;
`

const Message = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 3px 10px;
    border-radius: 50px;
    background-color: #999;
    color: #fff;
    transform: translate(-50%, -50%);
`

export type ILoadingProps = { children: any, Loader?: any, loading: boolean; };

const Loading = ({children, loading, Loader = <Message>Loading...</Message>}: ILoadingProps) => {
    const [show, setShow] = useState(false);
    const t = useRef<number>();

    useEffect(() => {
        if (loading) {
            t.current = setTimeout(() => {
                setShow(true)
            }, 500)
        } else {
            setShow(false)
            clearTimeout(t.current)
        }

        return () => clearTimeout(t.current)
    }, [loading])

    return (
        <Container>
            {show && loading && Loader}
            {children}
        </Container>
    );
}

const Title = styled.div`
    color: blue;
    font-size: 50px;
`

const ListContainer = styled.div`
    max-width: 400px;
    border: 1px solid #ccc;
    margin: 10px auto;
`

const list = css`
    display: flex;
    max-width: 400px;
    min-height: 100px;
`

const List = styled.ol`
    ${list}
`

const ListItem = styled.li`
    padding: 10px;
    width: 33%;
    text-align: center;
    border-right: 1px solid #eee;

    &:last-child {
        border-right: none;
    }
`

const Placeholder = styled.ol`
    ${list}
    color: #ccc;
`

export type IInjectedAboutProps = {
    items: IExampleListState;
    item?: IExampleItemState;
    onExampleGetList: IExampleGetList;
    $status?: IStatus;
};

export type IAboutProps = { testString: string; testNumber: number; } & IInjectedAboutProps;

import {useAction} from "../components/context";

const About = ({items, item, onExampleGetList, $status, ...props}: IAboutProps) => {
    // console.error("ABOUT", items.toJS(), item.toJS())
    // console.log("PROPS", items, props)
    // console.log("STATUS", Status($status))
    const {complete, isActive, processing} = Status($status);

    // useEffect(() => {
    //     onExampleGetList()
    // }, []);
    useAction(() => onExampleGetList(), "About");

    return (
        <Page>
            <Helmet>
                <title>About Page</title>
            </Helmet>
            <Title>
                This is the about page
            </Title>

            <ListContainer>
                <Loading loading={processing}>
                    {(!complete && items.length === 0 && (!isActive || processing)) ?
                        <Placeholder>
                            <ListItem>xxx</ListItem>
                            <ListItem>xxx</ListItem>
                            <ListItem>xxx</ListItem>
                        </Placeholder>
                        :
                        <List>
                            {items.map(item => (
                                <ListItem key={item.id}>
                                    {item.name}
                                </ListItem>
                            ))}
                        </List>
                    }
                </Loading>
            </ListContainer>
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
