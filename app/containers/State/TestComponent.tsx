import React, {ReactNode} from "react";
import styled from "@emotion/styled";

import Loading from "components/Loading";

import {DecoratedWithStatus, getStatus} from "./middleware";

import useWhatChanged from "components/whatChanged/useWhatChanged";

const Data = styled.pre`
  background-color: #eee;
  padding: 10px;
  white-space: pre-wrap;
  margin: 0 0 20px;
  font-family: 'courier new', monospace;
`;

const Option = styled.button`
  border: 1px solid #eee;
  border-radius: 3px;
  padding: 5px 8px;
  font-size: 1em;
  margin: 10px 0;
  
  + button {
    margin-left: 10px
  }
`;

const Description = styled.header`
  margin: 0 0 20px 0;
`;

type ExampleData = {id: string; data: string; timestamp: number} & DecoratedWithStatus;

export type TestComponentProps = {
    asyncData?: ExampleData;
    syncData?: ExampleData;
    getAsyncData: (id: string) => any;
    getSyncData: (id: string) => any;
    description?: ReactNode;
}

export const TestComponent = ({asyncData, syncData, getAsyncData, getSyncData, description}: TestComponentProps) => {
    useWhatChanged(TestComponent, {asyncData, syncData, getAsyncData, getSyncData});

    const handleGetAsyncData = () => getAsyncData("1234");
    const handleGetAsyncDataWithError = () => getAsyncData("error");
    const handleGetSyncData = () => getSyncData("5678");

    const statusAsyncData = getStatus(asyncData);

    return (
        <article>
            {description && <Description>{description}</Description>}
            <article>
                <header>
                    <h3>
                        <Loading inline={true} loading={statusAsyncData.processing}>
                            ASYNC
                        </Loading>
                    </h3>
                    <Option disabled={statusAsyncData.processing} onClick={handleGetAsyncData}>Get data</Option>
                    <Option disabled={statusAsyncData.processing} onClick={handleGetAsyncDataWithError}>Get data with error</Option>
                </header>
                {statusAsyncData && <Data>
                    STATUS: {JSON.stringify(statusAsyncData)}
                </Data>}
                {asyncData && <Data>
                    PAYLOAD: {JSON.stringify(asyncData)}
                </Data>}
            </article>
            <article>
                <header>
                    <h3>SYNC</h3>
                    <Option onClick={handleGetSyncData}>Get data</Option>
                </header>
                {syncData && <Data>
                    PAYLOAD: {JSON.stringify(syncData)}
                </Data>}
            </article>
        </article>
    );
};
