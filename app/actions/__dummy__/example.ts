import { createStandardAction } from 'typesafe-actions';

import { IPayload } from '../../components/redux/middleware/stateDecorator';

const exampleGetList = createStandardAction('@__dummy__/EXAMPLE_GET_LIST')
    .map(() => ({
        payload: ({ inject }: IPayload) => inject.services.exampleGetList()
    }));

const exampleGetItem = createStandardAction('@__dummy__/EXAMPLE_GET_ITEM')
    .map(() => ({
        payload: ({ inject }: IPayload) => inject.services.exampleGetItem()
    }));

export { exampleGetList, exampleGetItem };
