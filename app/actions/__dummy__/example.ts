import { createStandardAction } from 'typesafe-actions';

import { IPayload } from 'components/redux/middleware/stateDecorator';
import {IExampleItemState} from "../../reducers/__dummy__/example";

const exampleGetList = createStandardAction('@__dummy__/EXAMPLE_GET_LIST')
    .map(() => ({
        payload: ({ services }: IPayload) => services.exampleGetList(),
        meta: {
            hasRetry: true
        }
    }));

const exampleGetItem = createStandardAction('@__dummy__/EXAMPLE_GET_ITEM')
    .map(() => ({
        payload: ({ services }: IPayload) => services.exampleGetItem(),
        meta: {
            hasRetry: true
        }
    }));

const exampleEditItem = createStandardAction('@__dummy__/EXAMPLE_EDIT_ITEM')
    .map((item: IExampleItemState) => ({
        payload: ({ services }: IPayload) => services.exampleEditItem(item),
        meta: {
            id: item.id,
            seedPayload: item
        }
    }));

export { exampleGetList, exampleGetItem, exampleEditItem };
