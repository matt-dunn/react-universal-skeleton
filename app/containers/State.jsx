import React from "react";
import {Helmet} from "react-helmet-async";
import styled from "@emotion/styled";

import Page from "../styles/Page";

import {
    connect,
    getStore,
    simplePromiseDecorator,
} from "../exampleStateManagement";
import useWhatChanged from "../../components/whatChanged/useWhatChanged";

const Title = styled.h2`
    color: #ccc;
`;

// - Example reducers --------------------------------------------------------------------------------------------------------------------
const exampleReducer = (state, {type, payload}) => {
    switch (type) {
        case "SIMPLE_ASYNC_ACTION": {
            return {
                ...state,
                asyncData: payload
            };
        }
        case "SIMPLE_SYNC_ACTION": {
            return {
                ...state,
                syncData: payload
            };
        }
        default: {
            return state;
        }
    }
};

// - Example action creators --------------------------------------------------------------------------------------------------------------------
const simpleAsyncAction = id => ({
    type: "SIMPLE_ASYNC_ACTION",
    payload: new Promise(resolve => {
        setTimeout(() => {
            resolve({
                id,
                data: `Async data for ${id}`
            });
        }, 1000);
    })
});

const simpleSyncAction = id => ({
    type: "SIMPLE_SYNC_ACTION",
    payload: {id, data: `Sync data for ${id}`}
});

const rootReducer = {
    someData: exampleReducer
};

const myStore = getStore({}, rootReducer, [
    simplePromiseDecorator,
    // simpleAsyncDecorator,
    // simpleDecorator
]);

const StateComponent = ({asyncData, syncData, getAsyncData, getSyncData}) => {
    useWhatChanged(StateComponent, {asyncData, syncData, getAsyncData, getSyncData});

    return (
        <>
            <article>
                <h1>
                    ASYNC
                    <button disabled={asyncData?.$status.processing} onClick={() => getAsyncData("1234")}>Get data</button>
                </h1>
                <pre>
                    {JSON.stringify(asyncData)}
                </pre>
            </article>
            <article>
                <h1>
                    SYNC
                    <button onClick={() => getSyncData("5678")}>Get data</button>
                </h1>
                <pre>
                    {JSON.stringify(syncData)}
                </pre>
            </article>
        </>
    )
}

const mapStateToProps = state => {
    return {
        asyncData: state.someData?.asyncData,
        syncData: state.someData?.syncData,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAsyncData: id => dispatch(simpleAsyncAction(id)),
        getSyncData: id => dispatch(simpleSyncAction(id))
    }
}

const ConnectedStateComponent = connect(myStore, mapStateToProps, mapDispatchToProps)(StateComponent)

const State = () => {
    return (
        <Page>
            <Helmet>
                <title>State Test</title>
            </Helmet>

            <Title>
                State Test
            </Title>

            <ConnectedStateComponent/>
        </Page>
    );
};

export default State;
