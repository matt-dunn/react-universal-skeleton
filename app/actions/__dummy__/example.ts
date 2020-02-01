import { createAction } from "typesafe-actions";

import {Cancel} from "components/redux/middleware/sagaAsyncAction";
import {WithNotification} from "components/redux/middleware/sagaNotification";
import {ActionMeta} from "components/state-mutate-with-status";
// import {Severity} from "components/notification";

import {API, ExampleListResponse, ExampleResponse} from "../../components/api";

const exampleGetList = createAction<string, (cancel: Cancel) => (dep: API) => Promise<ExampleListResponse>, ActionMeta<ExampleListResponse> & WithNotification<ExampleListResponse>>(
    "@__dummy__/EXAMPLE_GET_LIST",
    ({page, count}) => cancel => ({api: {exampleApi: {exampleGetList}}}) => exampleGetList(page, count, cancel),
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

const exampleGetItem = createAction<string, (cancel: Cancel) => (dep: API) => Promise<ExampleResponse>, ActionMeta<ExampleResponse> & WithNotification<ExampleResponse>>(
    "@__dummy__/EXAMPLE_GET_ITEM",
    () => cancel => ({api: {exampleApi: {exampleGetItem}}}) => exampleGetItem(cancel),
    () => ({
        notification: (payload) => (payload && {
            message: "Got Item",
            reference: payload.id
        })
    })
)();

const exampleEditItem = createAction<string, (cancel: Cancel) => (dep: API) => Promise<ExampleResponse>, ActionMeta<ExampleResponse> & WithNotification<ExampleResponse>>(
    "@__dummy__/EXAMPLE_EDIT_ITEM",
    item => cancel => ({api: {exampleApi: {exampleEditItem}}}) => exampleEditItem(item, cancel),
    item => ({
        id: item.id,
        seedPayload: item,
        notification: (payload) => (payload && {
            message: "Item saved",
            reference: payload.id
        })
    })
)();

export { exampleGetList, exampleGetItem, exampleEditItem };
