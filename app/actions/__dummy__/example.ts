import { createStandardAction } from 'typesafe-actions';

import {IExampleItemState} from "../../reducers/__dummy__/example";
import {IExampleApi} from "../../components/api/__dummy__/example";

const exampleGetList = createStandardAction('@__dummy__/EXAMPLE_GET_LIST')
    .map(({page, count}: {page?: number; count?: number}) => ({
        payload: ({ services }: {services: IExampleApi}) => services.exampleGetList(page, count),
        meta: {
            hasRetry: true
        }
    }));

const exampleGetItem = createStandardAction('@__dummy__/EXAMPLE_GET_ITEM')
    .map(() => ({
        payload: ({ services }: {services: IExampleApi}) => services.exampleGetItem(),
        meta: {
            hasRetry: true
        }
    }));

const exampleEditItem = createStandardAction('@__dummy__/EXAMPLE_EDIT_ITEM')
    .map((item: IExampleItemState) => ({
        payload: ({ services }: {services: IExampleApi}) => services.exampleEditItem(item),
        meta: {
            hasRetry: true,
            id: item.id,
            seedPayload: item
        }
    }));

export { exampleGetList, exampleGetItem, exampleEditItem };
