import React from "react";
import {Helmet} from "react-helmet-async";
import styled from "@emotion/styled";

import Page from "../../styles/Page";

import {createAction, createReducer, getType, getStore, simplePromiseDecorator, StandardAction} from "./exampleStateManagement";
import {connect, StoreProvider} from "./connect";

import {TestComponent} from "./TestComponent";

// - Example types --------------------------------------------------------------------------------------------------------------------

type ExamplePayload = {id: string; data: string; timestamp: number};

type ExampleState = {
    asyncData?: ExamplePayload;
    syncData?: ExamplePayload;
}

type RootState = {
    someData?: ExampleState;
}

// - Example action creators --------------------------------------------------------------------------------------------------------------------

const simpleAsyncAction = createAction(
    "SIMPLE_ASYNC_ACTION",
    (id: string) => new Promise<ExamplePayload>((resolve, reject) => {
        setTimeout(() => {
            (id === "error" && reject(new Error("Oops"))) || resolve({
                id,
                data: `Async data for ${id}`,
                timestamp: Date.now()
            });
        }, 1000);
    })
);

const simpleSyncAction = createAction(
    "SIMPLE_SYNC_ACTION",
    (id: string) => ({
        id,
        data: `Sync data for ${id}`,
        timestamp: Date.now()
    })
);

// - Example reducers --------------------------------------------------------------------------------------------------------------------

const simpleAsyncReducer = (state: ExampleState, {payload}: StandardAction<ExamplePayload>): ExampleState => ({
    ...state,
    asyncData: {
        ...state?.asyncData,
        ...payload
    } as ExamplePayload
});

const simpleSyncReducer = (state: ExampleState, {payload}: StandardAction<ExamplePayload>): ExampleState => ({
    ...state,
    syncData: payload
});

const exampleReducer = createReducer({
    [getType(simpleAsyncAction)]: simpleAsyncReducer,
    [getType(simpleSyncAction)]: simpleSyncReducer
});

// - Example create, map and connect --------------------------------------------------------------------------------------------------------------------

const rootReducer = {
    someData: exampleReducer
};

const initialState: RootState = {};

const myStore = getStore(initialState, rootReducer, [
    simplePromiseDecorator,
    // simpleAsyncDecorator,
    // simpleDecorator
]);

const ConnectedTestComponent = connect(
    (state: RootState) => ({
        asyncData: state.someData?.asyncData,
        syncData: state.someData?.syncData
    }),
    dispatch => ({
        getAsyncData: (id: string) => dispatch(simpleAsyncAction(id)),
        getSyncData: (id: string) => dispatch(simpleSyncAction(id))
    })
)(TestComponent);

const Title = styled.h2`
    color: #ccc;
    margin: 0 0 20px 0;
`;

const State = () => {
    return (
        <StoreProvider store={myStore}>
            <Page>
                <Helmet>
                    <title>State Example</title>
                </Helmet>

                <Title>
                    State Example
                </Title>

                <ConnectedTestComponent
                    description="Simple flux-style implementation of state management with async payload decoration."
                />
            </Page>
        </StoreProvider>
    );
};

export default State;
