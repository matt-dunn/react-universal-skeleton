import React, {useCallback} from "react";
import {Helmet} from "react-helmet-async";
import styled from "@emotion/styled";
import {css} from "@emotion/core";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import TrackVisibility from "react-on-screen";
import { useParams} from "react-router";

import { IStatus } from "components/state-mutate-with-status/status";
import {AboveTheFold, ClientOnly} from "components/actions";
import List from "app/components/List";
import Item from "app/components/Item";
import EditItem from "app/components/EditItem";

import Page from "../styles/Page";
import * as actions from "../actions";
import {AppState} from "../reducers";
import {ExampleItemState} from "../reducers/__dummy__/example";
import {ExampleGetList, ExampleGetItem, ExampleEditItem} from "../components/api/__dummy__/example";

import useWhatChanged from "components/whatChanged/useWhatChanged";

export type DataProps = {
    items: ExampleItemState[];
    item?: ExampleItemState;
    onExampleGetList: ExampleGetList;
    onExampleGetItem: ExampleGetItem;
    onExampleEditItem: ExampleEditItem;
    $status?: IStatus;
};

const Title = styled.h2`
    color: #ccc;
`;

const DataItem = styled(EditItem)`
  margin: 50px auto;
  max-width: 300px;
`;

const DataListItem = styled(EditItem)<{isImportant?: boolean}>`
  ${({isImportant}) => isImportant && css`background-color: rgba(230, 230, 230, 0.5);`}
`;

const importantIds = ["item-1", "item-2"];

const Data = ({items, item, onExampleGetList, onExampleGetItem, onExampleEditItem, $status}: DataProps) => {
    const { page } = useParams();

    const renderListItem = useCallback(({item, disabled}) => {
        // return <div>ITEM - {item.name}</div>
        return <DataListItem item={item} disabled={disabled} onChange={onExampleEditItem} type="primary" isImportant={importantIds.indexOf(item.id) !== -1}/>;
    }, [onExampleEditItem]);

    const renderItem = useCallback(({ isVisible }) => <Item isShown={isVisible} item={item} onExampleGetItem={onExampleGetItem}/>, [item, onExampleGetItem]);

    useWhatChanged(Data, { items, item, onExampleGetList, onExampleGetItem, onExampleEditItem, $status, renderListItem, page});

    return (
        <Page>
            <Helmet>
                <title>API SSR Example</title>
                <meta name="description" content="Universal App Data Page" />
                <meta name="keywords" content="api, ssr,..." />
            </Helmet>
            <Title>
                API SSR Example (Lazy Loaded)
            </Title>

            <AboveTheFold>
                {/*<List items={items} onExampleGetList={onExampleGetList} onExampleEditItem={onExampleEditItem} activePage={parseInt(page || "0", 10)}>*/}
                {/*    /!*{(item: ExampleItemState) => {*!/*/}
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

            {items && items[0] && items[0].id && <DataItem item={items[0]} onChange={onExampleEditItem}/>}

            <div style={{height: "110vh"}}/>

            <TrackVisibility once={true} partialVisibility={true}>
                {renderItem}
            </TrackVisibility>

            <p>END.</p>
        </Page>
    );
};

const mapStateToProps = (state: AppState) => {
    const item = state.example.item;
    const items = state.example.items;
    const $status = state.example.$status;
    return { item, items, $status };
};

const mapDispatchToProps = (dispatch: Dispatch<actions.RootActions>) => {

    const onExampleGetList: ExampleGetList = (page, count): any => dispatch(actions.exampleActions.exampleGetList({page, count}));
    const onExampleGetItem: ExampleGetItem = (): any => dispatch(actions.exampleActions.exampleGetItem());
    const onExampleEditItem: ExampleEditItem = (item: ExampleItemState): any => dispatch(actions.exampleActions.exampleEditItem(item));

    return {
        onExampleGetList,
        onExampleGetItem,
        onExampleEditItem
    };
};

const container = connect(
    mapStateToProps,
    mapDispatchToProps
)(Data);

export default container;
