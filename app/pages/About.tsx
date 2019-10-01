import React, {useEffect, useState, useRef} from 'react'
import {Helmet} from 'react-helmet-async'

import useWhatChanged from "components/whatChanged/useWhatChanged";

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import Page from '../styles/Page'
import styled, {css} from "styled-components";

import {IAppState} from '../reducers';
// import {IExampleList, IExampleResponse} from '../components/api/__dummy__/example';

import * as actions from '../actions';

import {IExampleItemState} from '../reducers/__dummy__/example';
// import {IExampleAction} from '../container';
import Status, { IStatus } from 'components/state-mutate-with-status/status';
import {IExampleGetList, IExampleGetItem} from "../components/api/__dummy__/example";
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

export type ILoadingProps = { children: any; Loader?: any; loading: boolean };

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

const Title = styled.h1`
    color: #ccc;
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
    ${list};
    color: #ccc;
`

export type IInjectedAboutProps = {
    items: IExampleItemState[];
    item?: IExampleItemState;
    onExampleGetList: IExampleGetList;
    onExampleGetItem: IExampleGetItem;
    $status?: IStatus;
};

export type IAboutProps = { testString?: string; testNumber?: number } & IInjectedAboutProps;

import {usePerformAction, AboveTheFold, ClientOnly} from "components/actions";

// @ts-ignore
import handleViewport from 'react-in-viewport';

export type IViewportProps = { forwardedRef: () => {}; inViewport: boolean };
export type IStyledProps = { className: string };

const TheListContainer = ({forwardedRef, inViewport = true, items, $status, onExampleGetList, ...props}: IAboutProps & IViewportProps) => {
    const {complete, isActive, processing, hasError, error} = Status($status);

    useWhatChanged(TheListContainer, { forwardedRef, inViewport, items, $status, onExampleGetList, ...props });

    usePerformAction(
        () => {
            return onExampleGetList()
                .then(e => {
                    console.log("DONE", e)
                    return e;
                })
                .catch(ex => {
                    console.log("ERROR", ex.message)
                    throw ex;
                })
        },
        () => inViewport,
        [inViewport]
    );

    return (
        <ListContainer ref={forwardedRef}>
            [{inViewport ? "YES": "NO"}]
            {hasError && `Error occurred: ${error && error.message}`}
            <Loading loading={processing}>
                {!complete ?
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
    )
}

const TheList = React.memo(handleViewport(TheListContainer, {}, {disconnectOnLeave: true}));

const ItemContainer = styled.div`
    max-width: 400px;
    border: 1px solid #ccc;
    margin: 10px auto;
    padding: 10px;
`

const TheItemContainer = ({className, forwardedRef, inViewport = true, item, onExampleGetItem}: IAboutProps & IViewportProps & IStyledProps) => {
    const {complete, isActive, processing, hasError, error} = (item && Status(item.$status)) || {} as IStatus;

    useWhatChanged(TheItemContainer, { className, forwardedRef, inViewport, item, onExampleGetItem });

    usePerformAction(
        () => onExampleGetItem(),
        () => inViewport && !complete,
        [inViewport, complete]
    );

    return (
        <ItemContainer ref={forwardedRef} className={className}>
            [{inViewport ? "YES": "NO"}]
            {hasError && `Error occurred: ${error && error.message}`}
            <Loading loading={processing}>
                {!complete ?
                    <div>xxx</div>
                    :
                    <div className="item">{item && item.name}</div>
                }
            </Loading>
        </ItemContainer>
    )
}

const TheItem = React.memo(styled(handleViewport(TheItemContainer, undefined, {disconnectOnLeave: true}))`
    background-color: red;
    backface-visibility: hidden;

    .item {
        border: 5px solid blue;
    }
`);

const About = ({items, item, onExampleGetList, onExampleGetItem, $status, ...props}: IAboutProps) => {
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
                <TheList items={items} onExampleGetList={onExampleGetList} $status={$status}/>

                <ClientOnly>
                </ClientOnly>
            </AboveTheFold>

            <div style={{height: "110vh"}}/>

            <TheItem item={item} onExampleGetItem={onExampleGetItem}/>

            <p>END.</p>
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
