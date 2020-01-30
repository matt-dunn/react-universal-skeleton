import { createAction } from "typesafe-actions";

import {Cancel} from "components/redux/middleware/sagaAsyncAction";

import {ExampleItemState} from "../../reducers/__dummy__/example";
import {API} from "../../components/api";

const exampleGetList = createAction(
    "@__dummy__/EXAMPLE_GET_LIST",
    ({page, count}) => (cancel: Cancel) => ({api: {exampleApi: {exampleGetList}}}: API) => exampleGetList(page, count, cancel),
    // ({page, count}) => ([{"id": "1", "name": "xxx"}]),
    () => ({
        hasRetry: true,
        // seedPayload: [{id: "123", name: "Clem"}]
    })
)();

const exampleGetItem = createAction(
    "@__dummy__/EXAMPLE_GET_ITEM",
    () => (cancel: Cancel) => ({api: {exampleApi: {exampleGetItem}}}: API) => exampleGetItem(cancel),
    () => ({
        hasRetry: true
    })
)();

const exampleEditItem = createAction(
    "@__dummy__/EXAMPLE_EDIT_ITEM",
    (item) => (cancel: Cancel) => ({api: {exampleApi: {exampleEditItem}}}: API) => exampleEditItem(item, cancel),
    (item: ExampleItemState) => ({
        hasRetry: true,
        id: item.id,
        seedPayload: item
    })
)();

export { exampleGetList, exampleGetItem, exampleEditItem };
