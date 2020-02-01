import { createAction } from "typesafe-actions";

import {Cancel} from "components/redux/middleware/sagaAsyncAction";
import {WithNotification} from "components/redux/middleware/sagaNotification";
import {ActionMeta} from "components/state-mutate-with-status";
// import {Severity} from "components/notification";

import {ExampleItemsState, ExampleItemState} from "../../reducers/__dummy__/example";
import {API} from "../../components/api";

const exampleGetList = createAction<string, any, ActionMeta & WithNotification<ExampleItemsState>>(
    "@__dummy__/EXAMPLE_GET_LIST",
    ({page, count}) => (cancel: Cancel) => ({api: {exampleApi: {exampleGetList}}}: API) => exampleGetList(page, count, cancel),
    // ({page, count}) => ([{"id": "1", "name": "xxx"}]),
    () => ({
        // seedPayload: [{id: "123", name: "Clem"}]
        // notification: (payload, error) => {
        //     console.error("@@@@", payload, error && error.message);
        //     if (error) {
        //         return {
        //             message: "Error",
        //             severity: Severity.error
        //         };
        //     } else if (payload) {
        //         return {
        //             message: `OK - got ${payload.length} items`
        //         };
        //     }
        // }
    })
)();

const exampleGetItem = createAction(
    "@__dummy__/EXAMPLE_GET_ITEM",
    () => (cancel: Cancel) => ({api: {exampleApi: {exampleGetItem}}}: API) => exampleGetItem(cancel),
    () => ({
    })
)();

const exampleEditItem = createAction<string, any, ActionMeta & WithNotification<ExampleItemState>>(
    "@__dummy__/EXAMPLE_EDIT_ITEM",
    (item) => (cancel: Cancel) => ({api: {exampleApi: {exampleEditItem}}}: API) => exampleEditItem(item, cancel),
    (item: ExampleItemState) => ({
        id: item.id,
        seedPayload: item,
        notification: (payload) => (payload && {
            message: "Item saved",
            reference: payload.id
        })
    })
)();

export { exampleGetList, exampleGetItem, exampleEditItem };
