import { createStandardAction } from 'typesafe-actions';

import { IPayload } from '../../components/redux/middleware/stateDecorator';

export interface Login {
    username: string;
    password: string;
}

const login = createStandardAction('@auth/LOGIN')
    .map(({username, password}: Login) => ({
        payload: ({ inject }: IPayload) => inject.services.login(username, password)
    }));

export { login };
