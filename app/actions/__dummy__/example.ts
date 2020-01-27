import { createAction } from "typesafe-actions";

import {ExampleItemState} from "../../reducers/__dummy__/example";
import {ExampleApi} from "../../components/api/__dummy__/example";

const exampleGetList = createAction(
    "@__dummy__/EXAMPLE_GET_LIST",
    ({page, count}: {page?: number; count?: number}) => ({page, count}),
    // ({page, count}: {page?: number; count?: number}) => ({ services }: {services: ExampleApi}) => services.exampleGetList(page, count),
    // () => ({
    //     hasRetry: true
    // })
)();

const exampleGetItem = createAction(
    "@__dummy__/EXAMPLE_GET_ITEM",
    () => ({ services }: {services: ExampleApi}) => services.exampleGetItem(),
    () => ({
        hasRetry: true
    })
)();

const exampleEditItem = createAction(
    "@__dummy__/EXAMPLE_EDIT_ITEM",
    (item: ExampleItemState) => ({ services }: {services: ExampleApi}) => services.exampleEditItem(item),
    (item: ExampleItemState) => ({
        hasRetry: true,
        id: item.id,
        seedPayload: item
    })
)();

export { exampleGetList, exampleGetItem, exampleEditItem };
