import React, {useCallback} from "react";
import {Helmet} from "react-helmet-async";
import styled from "@emotion/styled";
import {css} from "@emotion/core";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import TrackVisibility from "react-on-screen";
import { useParams} from "react-router";

import {DecoratedWithStatus, getStatus} from "components/state-mutate-with-status";
import {AboveTheFold, ClientOnly} from "components/actions";
import {ModalFooter, ModalTitle, useModal} from "components/Modal";
import {Button, ButtonSimple, ButtonSimplePrimary} from "components/Buttons";
import {withWireFrameAnnotation} from "components/Wireframe";
import {Notify, Notification, notifyAction} from "components/notification";

import List from "app/components/List";
import Item from "app/components/Item";
import EditItem from "app/components/EditItem";

import Page from "../styles/Page";
import * as actions from "../actions";
import {AppState} from "../reducers";
import {ExampleItemState} from "../reducers/__dummy__/example";
import {ExampleGetList, ExampleGetItem, ExampleEditItem} from "../components/api/__dummy__/example";

import useWhatChanged from "components/whatChanged/useWhatChanged";

export type DataProps = {
    items: ExampleItemState[];
    item?: ExampleItemState & DecoratedWithStatus;
    onExampleGetList: ExampleGetList;
    onExampleGetItem: ExampleGetItem;
    onExampleEditItem: ExampleEditItem;
    notify: Notify;
};

const Title = styled.h2`
    color: #ccc;
`;

const ModelOptions = styled.div`
  margin: 10px 0 0 0;
`;

const DataItem = styled(EditItem)`
  margin: 50px auto;
  max-width: 300px;
`;

const DataListItem = styled(EditItem)<{isImportant?: boolean}>`
  ${({isImportant}) => isImportant && css`background-color: rgba(230, 230, 230, 0.5);`}
`;

const importantIds = ["item-1", "item-2"];

const WSButtons = withWireFrameAnnotation(ModelOptions, {
    title: <div>Open modal CTA</div>,
    description: <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam iaculis convallis ante, ac porttitor eros hendrerit non. Ut a hendrerit ligula. Praesent vestibulum, dui venenatis convallis condimentum, lorem magna rutrum erat, eget convallis odio purus sed ex. Suspendisse congue metus ac blandit vehicula. Suspendisse non elementum purus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const WSTitle = withWireFrameAnnotation(Title, {
    title: <div>Page title</div>,
    description: <div>Data page title. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const WAModalButton = withWireFrameAnnotation(Button, {
    title: <div>Focus modal button</div>,
    description: <div>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const WAModalSubmit = withWireFrameAnnotation(ButtonSimplePrimary, {
    title: <div>Submit button</div>,
    description: <div>Only enabled once the data is available.</div>
});

const Data = ({notify, items, item, onExampleGetList, onExampleGetItem, onExampleEditItem}: DataProps) => {
    const { page } = useParams();

    const renderListItem = useCallback(({item, disabled}) => {
        // return <div>ITEM - {item.name}</div>
        return <DataListItem item={item} disabled={disabled} onChange={onExampleEditItem} type="primary" isImportant={importantIds.indexOf(item.id) !== -1}/>;
    }, [onExampleEditItem]);

    const renderItem = useCallback(({ isVisible }) => <Item isShown={isVisible} item={item} onExampleGetItem={onExampleGetItem}/>, [item, onExampleGetItem]);

    const [modal, open, close] = useModal<Pick<DataProps, "item" | "onExampleGetItem">>({item, onExampleGetItem});

    const openTest1 = () => {
        open(({item, onExampleGetItem}) => {
            console.log("RENDER MODAL CHILDREN", item);
            return (
                <Item isShown={true} item={item} onExampleGetItem={onExampleGetItem}/>
            );
        })
            .then(() => {
                console.log("CLOSED 1...");
            });
    };

    const openTest2 = () => {
        open(
            ({item, onExampleGetItem}) => {
                const {complete} = getStatus(item);
                const submit = () => {
                    notify({message: "Submit..."});
                    close();
                };

                return (
                    <>
                        <address>
                            Some content...{" "}
                            <WAModalButton
                            >
                                Focusable element
                            </WAModalButton>
                        </address>
                        <Item isShown={true} item={item} onExampleGetItem={onExampleGetItem}/>
                        <ModalFooter>
                            <ButtonSimple
                                onClick={close}
                            >
                                Cancel
                            </ButtonSimple>
                            <WAModalSubmit
                                onClick={submit}
                                disabled={!item || !complete}
                            >
                                Submit
                            </WAModalSubmit>
                        </ModalFooter>
                        <ModalTitle hasClose={true}>Test Modal With Data</ModalTitle>
                        More content...
                    </>
                );
            },
            {
                isStatic: true
            })
            .then(() => {
                console.log("CLOSED 2...");
            });
    };

    useWhatChanged(Data, { modal, open, close, items, item, onExampleGetList, onExampleGetItem, onExampleEditItem, renderListItem, page});

    return (
        <Page>
            <Helmet>
                <title>API SSR Example</title>
                <meta name="description" content="Universal App Data Page" />
                <meta name="keywords" content="api, ssr,..." />
            </Helmet>
            <WSTitle>
                API SSR Example (Lazy Loaded)
            </WSTitle>

            <WSButtons>
                <Button
                    onClick={openTest1}
                >
                    Open SIMPLE modal
                </Button>

                <Button
                    onClick={openTest2}
                >
                    Open FULL modal
                </Button>
            </WSButtons>

            {modal()}

            <AboveTheFold>
                {/*<List items={items} onExampleGetList={onExampleGetList} onExampleEditItem={onExampleEditItem} activePage={parseInt(page || "0", 10)}>*/}
                {/*    /!*{(item: ExampleItemState) => {*!/*/}
                {/*    /!*    return <div>ITEM - {item.name}</div>*!/*/}
                {/*    /!*}}*!/*/}
                {/*</List>*/}
                {/*<TrackVisibility once={true} partialVisibility={true}>*/}
                {/*    {({ isVisible }) => <List isShown={isVisible} items={items} onExampleGetList={onExampleGetList} onExampleEditItem={onExampleEditItem}/>}*/}
                {/*</TrackVisibility>*/}

                <List items={items} onExampleGetList={onExampleGetList} onExampleEditItem={onExampleEditItem} activePage={parseInt(page || "0", 10)}>
                    {renderListItem}
                </List>

                <ClientOnly>
                </ClientOnly>
            </AboveTheFold>

            {/*<TrackVisibility once={true} partialVisibility={true}>*/}
            {/*    {({ isVisible }) =>*/}
            {/*        <List isShown={isVisible} items={items} onExampleGetList={onExampleGetList} onExampleEditItem={onExampleEditItem} activePage={parseInt(page || "0", 10)}>*/}
            {/*            {renderListItem}*/}
            {/*        </List>*/}
            {/*    }*/}
            {/*</TrackVisibility>*/}

            {/*<TrackVisibility once={true} partialVisibility={true}>*/}
            {/*    {({ isVisible }) => items && items[0] && items[0].id && <EditItem item={items[0]} onChange={onExampleEditItem}/>}*/}
            {/*</TrackVisibility>*/}

            {items && items[0] && items[0].id && <DataItem item={items[0]} onChange={onExampleEditItem}/>}

            <div style={{height: "110vh"}}/>

            <TrackVisibility once={true} partialVisibility={true}>
                {renderItem}
            </TrackVisibility>

            <p>END.</p>
        </Page>
    );
};

const mapStateToProps = (state: AppState) => {
    const item = state.example.item;
    const items = state.example.items;
    return { item, items };
};

const mapDispatchToProps = (dispatch: Dispatch<actions.RootActions>) => {

    const onExampleGetList: ExampleGetList = (page, count): any => dispatch(actions.exampleActions.exampleGetList({page, count}));
    const onExampleGetItem: ExampleGetItem = (): any => dispatch(actions.exampleActions.exampleGetItem());
    const onExampleEditItem: ExampleEditItem = (item: ExampleItemState): any => dispatch(actions.exampleActions.exampleEditItem(item));

    return {
        onExampleGetList,
        onExampleGetItem,
        onExampleEditItem,
        notify: (notification: Notification) => dispatch(notifyAction(notification))
    };
};

const container = connect(
    mapStateToProps,
    mapDispatchToProps
)(Data);

export default container;
