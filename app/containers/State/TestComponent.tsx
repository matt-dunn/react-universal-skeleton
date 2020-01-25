import React, {ComponentType, ReactNode} from "react";
import styled from "@emotion/styled";

import Loading from "components/Loading";

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

type ExampleData = {id: string; data: string; timestamp: number; $status?: {processing: boolean}};

export type TestComponentProps = {
    asyncData: ExampleData;
    syncData: ExampleData;
    getAsyncData: any;
    getSyncData: any;
    description?: ReactNode;
}

export const TestComponent = ({asyncData, syncData, getAsyncData, getSyncData, description}: TestComponentProps) => {
    useWhatChanged(TestComponent, {asyncData, syncData, getAsyncData, getSyncData});

    const handleGetAsyncData = () => getAsyncData("1234");
    const handleGetAsyncDataWithError = () => getAsyncData("error");
    const handleGetSyncData = () => getSyncData("5678");

    return (
        <article>
            {description && <Description>{description}</Description>}
            <article>
                <header>
                    <h3>
                        <Loading inline={true} loading={asyncData?.$status?.processing || false}>
                            ASYNC
                        </Loading>
                    </h3>
                    <Option disabled={asyncData?.$status?.processing} onClick={handleGetAsyncData}>Get data</Option>
                    <Option disabled={asyncData?.$status?.processing} onClick={handleGetAsyncDataWithError}>Get data with error</Option>
                </header>
                {asyncData && <Data>
                    {JSON.stringify(asyncData)}
                </Data>}
            </article>
            <article>
                <header>
                    <h3>SYNC</h3>
                    <Option onClick={handleGetSyncData}>Get data</Option>
                </header>
                {syncData && <Data>
                    {JSON.stringify(syncData)}
                </Data>}
            </article>
        </article>
    );
};


export type GetProps<C> = C extends ComponentType<infer P> ? P : never;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Shared<
    InjectedProps,
    DecorationTargetProps
    > = {
    [P in Extract<keyof InjectedProps, keyof DecorationTargetProps>]?: InjectedProps[P] extends DecorationTargetProps[P] ? DecorationTargetProps[P] : never;
};


type MapStateToProps<S, TState> = {
    (state: TState): S
}

type MapDispatchToProps<S> = {
    (): S
}

const xx = <C extends ComponentType<any>, O, P extends GetProps<C>, S extends Partial<GetProps<C>>, T extends Partial<GetProps<C>>, TState = {}>(
    Component: C,
    mapStateToProps: MapStateToProps<S, TState>,
    mapDispatchToProps: MapDispatchToProps<T>
): {test: {(props?: P): Omit<GetProps<C>, keyof Shared<S & T, GetProps<C>>>}} => {
    const state: TState = {} as TState;

    return {
        test: (props) => {
            return {
                ...props,
                ...mapStateToProps(state),
                ...mapDispatchToProps()
            }
        }
    }
}

const x = xx(
    TestComponent,
    (state) => {
        return {
            asyncData: {id: "2", data: "", timestamp: 234},
            // syncData: {id: "2", data: "", timestamp: 234},
            xxx: state
        }
    },
    () => {
        return {
            getAsyncData: 34,
            getSyncData: 34
        }
    }
)

const y = x.test()

const aa1 =y.asyncData;
const aa2 =y.syncData;
const aa3 =y.getAsyncData;
const aa4 =y.getSyncData;
const aa5 =y.description;
