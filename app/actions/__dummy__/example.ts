import { createAction } from "typesafe-actions";

import {ExampleItemState} from "../../reducers/__dummy__/example";

import services from "../../components/api/__dummy__/example";

const exampleGetList = createAction(
    "@__dummy__/EXAMPLE_GET_LIST",
    // ({}: {page?: number; count?: number}) => undefined,
    // ({page, count}) => ({
    //     params: {page, count}
    // })
    // ({page, count}: {page?: number; count?: number}) => ({ services }: {services: ExampleApi}) => services.exampleGetList(page, count),
    // () => ({
    //     hasRetry: true
    // })
    ({page, count}: {page?: number; count?: number}) => (cancel: any) => services.exampleGetList(page, count, cancel),
    () => ({
        hasRetry: true,
        // seedPayload: [{id: "123", name: "Clem"}]
    })
)();

const exampleGetItem = createAction(
    "@__dummy__/EXAMPLE_GET_ITEM",
    () => (cancel: any) => services.exampleGetItem(cancel),
    () => ({
        hasRetry: true
    })
)();

const exampleEditItem = createAction(
    "@__dummy__/EXAMPLE_EDIT_ITEM",
    (item: ExampleItemState) => (cancel: any) => services.exampleEditItem(item, cancel),
    (item: ExampleItemState) => ({
        hasRetry: true,
        id: item.id,
        seedPayload: item
    })
)();

export { exampleGetList, exampleGetItem, exampleEditItem };
