import React from "react";
import {Helmet} from "react-helmet-async";
import { connect } from "react-redux";
import { useParams} from "react-router";

import {DecoratedWithStatus} from "components/state-mutate-with-status";
import {withWireframeAnnotation} from "@matt-dunn/react-wireframes";
import {Notify, notifyAction} from "components/notification";

import {GetList, Items} from "app/components/List";
import {GetItem, Item} from "app/components/Item";
import {OnChange} from "app/components/EditItem";

import {Main, Title} from "app/styles/Components";
import * as actions from "app/actions";
import {AppState} from "app/reducers";

import Modals from "app/components/Modals";
import Lists from "app/components/Lists";

import useWhatChanged from "components/whatChanged/useWhatChanged";

type DataProps = {
    items: Items;
    item?: Item & DecoratedWithStatus;
    exampleGetList: GetList;
    exampleGetItem: GetItem;
    exampleEditItem: OnChange;
    notify: Notify;
};

const WSTitle = withWireframeAnnotation({
    title: "Page title",
    description: "Data page title. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
})(Title);

const Data = ({notify, items, item, exampleGetList, exampleGetItem, exampleEditItem}: DataProps) => {
    const { page } = useParams();

    useWhatChanged(Data, { items, item, exampleGetList, exampleGetItem, exampleEditItem, page});

    return (
        <Main>
            <Helmet>
                <title>API SSR Example</title>
                <meta name="description" content="Universal App Data Page" />
                <meta name="keywords" content="api, ssr,..." />
            </Helmet>

            <WSTitle>
                API SSR Example (Lazy Loaded)
            </WSTitle>

            <Modals getItem={exampleGetItem} notify={notify} item={item}/>

            <Lists item={item} items={items} exampleGetList={exampleGetList} exampleGetItem={exampleGetItem} exampleEditItem={exampleEditItem}/>
        </Main>
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
