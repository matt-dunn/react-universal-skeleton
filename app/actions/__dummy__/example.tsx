import React from "react";
import { createAction } from "typesafe-actions";
import {FormattedMessage} from "react-intl";

import {WithNotification} from "components/redux/middleware/sagaNotification";
import {ActionMeta} from "components/state-mutate-with-status";
import {Severity} from "components/notification";

import {ExampleList, ExampleItem} from "../../components/api";
import {APIPayloadCreator} from "../";

const exampleGetList = createAction<string, APIPayloadCreator<Promise<ExampleList>>, ActionMeta<ExampleList>, [number?, number?]>(
    "@__dummy__/EXAMPLE_GET_LIST",
    (page, count) => signal => ({API: {ExampleApi: {exampleGetList}}}) => exampleGetList(page, count)(signal),
)();

const exampleGetItem = createAction<string, APIPayloadCreator<Promise<ExampleItem>>, ActionMeta<ExampleItem> & WithNotification<ExampleItem>, []>(
    "@__dummy__/EXAMPLE_GET_ITEM",
    () => signal => ({API: {ExampleApi: {exampleGetItem}}}) => exampleGetItem()(signal),
    () => ({
        notification: (payload) => (payload && {
            message: <FormattedMessage
                defaultMessage="Got Item"
                description="Success message when getting an example item"
            />,
            reference: payload.id,
        })
    })
)();

const exampleEditItem = createAction<string, APIPayloadCreator<Promise<ExampleItem>>, ActionMeta<ExampleItem> & WithNotification<ExampleItem>, [ExampleItem]>(
    "@__dummy__/EXAMPLE_EDIT_ITEM",
    item => signal => ({API: {ExampleApi: {exampleEditItem}}}) => exampleEditItem(item)(signal),
    item => ({
        id: item.id,
        seedPayload: item,
        notification: (payload, error, meta) => (payload && {
            message: "Item saved",
            reference: meta.id
        }) || {
            message: "Unable to save item",
            severity: Severity.error,
            reference: meta.id
        }
    })
)();

export { exampleGetList, exampleGetItem, exampleEditItem };
