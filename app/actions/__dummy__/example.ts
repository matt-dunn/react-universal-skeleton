import { createStandardAction } from 'typesafe-actions';

import { IExampleResponse } from '../../components/api/__dummy__/example';
import { IPayload } from '../../components/redux/middleware/stateDecorator';

// import { IRootService } from 'web/config/service.config';

const example = createStandardAction('@__dummy__/EXAMPLE')
    .map(({ id, name }: IExampleResponse) => ({
        payload: ({ inject }: IPayload) => inject('service')((service: any) => service.exampleApi.example(id, name)),
        meta: { id, seedPayload: { id, name } },
    }));

type Notification = {
    username: string;
    message?: string
};

const exampleList = createStandardAction('@__dummy__/EXAMPLE_LIST')
    .map(({ id, name }: IExampleResponse, meta: Notification) => ({
        payload: ({ inject }: IPayload) => inject('service')((service: any) => service.exampleApi.exampleList(id, name)),
        meta: { id, ...meta },
    }));

export { example, exampleList };
