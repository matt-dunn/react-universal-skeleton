import { createAction } from "typesafe-actions";

import {WithNotification} from "components/redux/middleware/sagaNotification";
import {ActionMeta} from "components/state-mutate-with-status";
import {Severity} from "components/notification";

import {ExampleList, ExampleItem} from "../../components/api";
import {APIPayloadCreator} from "../";

const exampleGetList = createAction<string, APIPayloadCreator<Promise<ExampleList>>, ActionMeta<ExampleList> & WithNotification<ExampleList>>(
    "@__dummy__/EXAMPLE_GET_LIST",
    // ({page, count}) => cancel => Promise.resolve([{"id": "1", "name": "xxx"}]),
    (page, count) => cancel => ({API: {ExampleApi: {exampleGetList}}}) => exampleGetList(page, count)(cancel),
    // ({page, count}) => ([{"id": "1", "name": "xxx"}]),
    // () => ({
    //     // seedPayload: [{id: "123", name: "Clem"}],
    //     notification: (payload, error) => {
    //         if (error) {
    //             return {
    //                 message: "Error",
    //                 severity: Severity.error
    //             };
    //         } else if (payload) {
    //             return {
    //                 message: `OK - got ${payload.length} items`
    //             };
    //         }
    //     }
    // })
)();

const exampleGetItem = createAction<string, APIPayloadCreator<Promise<ExampleItem>>, ActionMeta<ExampleItem> & WithNotification<ExampleItem>>(
    "@__dummy__/EXAMPLE_GET_ITEM",
    () => cancel => ({API: {ExampleApi: {exampleGetItem}}}) => exampleGetItem()(cancel),
    () => ({
        notification: (payload) => (payload && {
            message: "Got Item",
            reference: payload.id
        })
    })
)();

const exampleEditItem = createAction<string, APIPayloadCreator<Promise<ExampleItem>>, ActionMeta<ExampleItem> & WithNotification<ExampleItem>>(
    "@__dummy__/EXAMPLE_EDIT_ITEM",
    item => cancel => ({API: {ExampleApi: {exampleEditItem}}}) => exampleEditItem(item)(cancel),
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
