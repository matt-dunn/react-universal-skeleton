import React from "react";
import {Helmet} from "react-helmet-async";
import styled from "@emotion/styled";

import Page from "../../styles/Page";

import {
    connect,
    createAction,
    createReducer,
    getType,
    getStore,
    simplePromiseDecorator,
    StoreProvider,
} from "./exampleStateManagement";

import {TestComponent} from "./TestComponent";

// - Example action creators --------------------------------------------------------------------------------------------------------------------

const simpleAsyncAction = createAction(
    "SIMPLE_ASYNC_ACTION",
    id => new Promise((resolve, reject) => {
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
    id => ({
        id,
        data: `Sync data for ${id}`,
        timestamp: Date.now()
    })
);

// - Example reducers --------------------------------------------------------------------------------------------------------------------

const exampleReducer = createReducer({
    [getType(simpleAsyncAction)]: (state, {payload}) => ({
        ...state,
        asyncData: {
            ...state?.asyncData,
            ...payload
        }
    }),
    [getType(simpleSyncAction)]: (state, {payload}) => ({
        ...state,
        syncData: payload
    }),
});

// - Example create, map and connect --------------------------------------------------------------------------------------------------------------------

const rootReducer = {
    someData: exampleReducer
};

const myStore = getStore({}, rootReducer, [
    simplePromiseDecorator,
    // simpleAsyncDecorator,
    // simpleDecorator
]);

const mapStateToProps = state => {
    return {
        asyncData: state.someData?.asyncData,
        syncData: state.someData?.syncData,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAsyncData: id => dispatch(simpleAsyncAction(id)),
        getSyncData: id => dispatch(simpleSyncAction(id))
    };
};

const ConnectedTestComponent = connect(mapStateToProps, mapDispatchToProps)(TestComponent);

const Title = styled.h2`
    color: #ccc;
    margin: 0 0 20px 0;
`;

const State = () => {
    return (
        <StoreProvider value={myStore}>
            <Page>
                <Helmet>
                    <title>State Test</title>
                </Helmet>

                <Title>
                    State Test
                </Title>

                <ConnectedTestComponent/>
            </Page>
        </StoreProvider>
    );
};

export default State;
