import { createStandardAction } from "typesafe-actions";

import {ExampleItemState} from "../../reducers/__dummy__/example";
import {ExampleApi} from "../../components/api/__dummy__/example";

const exampleGetList = createStandardAction("@__dummy__/EXAMPLE_GET_LIST")
    .map(({page, count}: {page?: number; count?: number}) => ({
        payload: ({ services }: {services: ExampleApi}) => services.exampleGetList(page, count),
        meta: {
            hasRetry: true
        }
    }));

const exampleGetItem = createStandardAction("@__dummy__/EXAMPLE_GET_ITEM")
    .map(() => ({
        payload: ({ services }: {services: ExampleApi}) => services.exampleGetItem(),
        meta: {
            hasRetry: true
        }
    }));

const exampleEditItem = createStandardAction("@__dummy__/EXAMPLE_EDIT_ITEM")
    .map((item: ExampleItemState) => ({
        payload: ({ services }: {services: ExampleApi}) => services.exampleEditItem(item),
        meta: {
            hasRetry: true,
            id: item.id,
            seedPayload: item
        }
    }));

export { exampleGetList, exampleGetItem, exampleEditItem };
