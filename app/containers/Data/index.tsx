import React from "react";
import {Helmet} from "react-helmet-async";
import styled from "@emotion/styled";
import {css} from "@emotion/core";
import { connect } from "react-redux";
import TrackVisibility from "react-on-screen";
import { useParams} from "react-router";

import {DecoratedWithStatus} from "components/state-mutate-with-status";
import {AboveTheFold} from "components/actions";
import {withWireFrameAnnotation} from "components/Wireframe";
import {Notify, notifyAction} from "components/notification";

import List, {GetList, Items} from "app/components/List";
import SimpleItem, {GetItem, Item} from "app/components/Item";
import EditItem, {OnChange} from "app/components/EditItem";

import Page from "app/styles/Page";
import * as actions from "app/actions";
import {AppState} from "app/reducers";

import Modals from "./Modals";

import useWhatChanged from "components/whatChanged/useWhatChanged";

export type DataProps = {
    items: Items;
    item?: Item & DecoratedWithStatus;
    exampleGetList: GetList;
    exampleGetItem: GetItem;
    exampleEditItem: OnChange;
    notify: Notify;
};

const Title = styled.h2`
    color: #ccc;
`;

const DataListItem = styled(EditItem)<{isImportant?: boolean}>`
  ${({isImportant}) => isImportant && css`background-color: rgba(230, 230, 230, 0.5);`}
`;

const importantIds = ["item-1", "item-2"];

const WSTitle = withWireFrameAnnotation(Title, {
    title: <div>Page title</div>,
    description: <div>Data page title. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const Data = ({notify, items, item, exampleGetList, exampleGetItem, exampleEditItem}: DataProps) => {
    const { page } = useParams();

    useWhatChanged(Data, { items, item, exampleGetList, exampleGetItem, exampleEditItem, page});

    return (
        <Page>
            <Helmet>
                <title>API SSR Example</title>
                <meta name="description" content="Universal App Data Page" />
                <meta name="keywords" content="api, ssr,..." />
            </Helmet>

            <WSTitle>
                API SSR Example (Lazy Loaded)
            </WSTitle>

            <Modals getItem={exampleGetItem} notify={notify} item={item}/>

            <AboveTheFold>
                <List items={items} getList={exampleGetList} editItem={exampleEditItem} activePage={parseInt(page || "0", 10)}>
                    {({item, disabled}) => (
                        <DataListItem item={item} disabled={disabled} onChange={exampleEditItem} type="primary" isImportant={importantIds.indexOf(item.id) !== -1}/>
                    )}
                </List>
            </AboveTheFold>

            <div style={{height: "110vh"}}/>

            <TrackVisibility once={true} partialVisibility={true}>
                {({ isVisible }) => <SimpleItem isShown={isVisible} item={item} getItem={exampleGetItem}/>}
            </TrackVisibility>

            <div style={{height: "10vh"}}/>
        </Page>
    );
};

const container = connect(
    ({example: {item, items}}: AppState) => ({
        item,
        items
    } as DataProps),
    {
        exampleGetList: actions.exampleActions.exampleGetList,
        exampleGetItem: actions.exampleActions.exampleGetItem,
        exampleEditItem: actions.exampleActions.exampleEditItem,
        notify: notifyAction
    }
)(Data);

export default container;
