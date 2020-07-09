import React from "react";
import { createAction } from "typesafe-actions";
import {FormattedMessage} from "react-intl";

import {WithNotification} from "components/redux/middleware/sagaNotification";
import {ActionMeta} from "components/state-mutate-with-status";
import {Severity} from "components/notification";

import {ExampleList, ExampleItem, Kitten} from "../../components/api";
import {APIPayloadCreator} from "../";

const exampleGetDBItem = createAction<string, APIPayloadCreator<Promise<Kitten>>, ActionMeta<Kitten>, [string]>(
  "@__dummy__/EXAMPLE_GET_DB_ITEM",
  (id) => signal => ({API: {ExampleApi: {exampleGetDBItem}}}) => exampleGetDBItem(id)(signal),
)();

const exampleUpdateDBItem = createAction<string, APIPayloadCreator<Promise<Kitten>>, ActionMeta<Kitten>, [Kitten]>(
  "@__dummy__/EXAMPLE_UPDATE_DB_ITEM",
  (item) => signal => ({API: {ExampleApi: {exampleUpdateDBItem}}}) => exampleUpdateDBItem(item)(signal),
)();

const exampleSaveDBItem = createAction<string, APIPayloadCreator<Promise<Kitten>>, ActionMeta<Kitten>, [Kitten]>(
  "@__dummy__/EXAMPLE_SAVE_DB_ITEM",
  (item) => signal => ({API: {ExampleApi: {exampleSaveDBItem}}}) => exampleSaveDBItem(item)(signal),
)();

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

export {
  exampleGetDBItem,
  exampleUpdateDBItem,
  exampleSaveDBItem,
  exampleGetList,
  exampleGetItem,
  exampleEditItem
};
