import React, {useCallback, useState} from "react";
import styled, {css} from "styled-components";
import handleViewport, {ReactInViewportProps} from 'react-in-viewport';

import Status, {IStatus} from "components/state-mutate-with-status/status";
import Loading from "components/Loading";
import {usePerformAction} from "components/actions";

import {IExampleItemState} from "../../reducers/__dummy__/example";
import {ExampleEditItem, IExampleGetList} from "../api/__dummy__/example";

import Item from "./Item";

import useWhatChanged from "components/whatChanged/useWhatChanged";

export type ListProps = {
    items: IExampleItemState[];
    onExampleGetList: IExampleGetList;
    onExampleEditItem: ExampleEditItem;
    $status?: IStatus;
};

const ListContainer = styled.div`
    max-width: 400px;
    border: 1px solid #ccc;
    margin: 10px auto;
`;

const list = css`
    display: flex;
    max-width: 400px;
    min-height: 100px;
`;

const ListItems = styled.ol`
    ${list}
`;

const ListItem = styled.li`
    padding: 10px;
    width: 33%;
    text-align: center;
    border-right: 1px solid #eee;

    &:last-child {
        border-right: none;
    }
`;

const Placeholder = styled.ol`
    ${list};
    color: #ccc;
`

const List = ({forwardedRef, inViewport = true, items, $status, onExampleGetList, onExampleEditItem, ...props}: ListProps & ReactInViewportProps) => {
    useWhatChanged(List, { forwardedRef, inViewport, items, $status, onExampleGetList, onExampleEditItem, ...props });

    const {complete, isActive, processing, hasError, error} = Status($status);

    const [editId, setEditId] = useState();

    usePerformAction(
        () => {
            return onExampleGetList()
                .then(e => {
                    console.log("DONE", e)
                    return e;
                })
                .catch(ex => {
                    console.log("ERROR", ex.message)
                    throw ex;
                })
        },
        () => inViewport,
        [inViewport]
    );

    const handleEdit = useCallback(
        (item: IExampleItemState) => {
            setEditId(item.id)
        },
        []
    );

    const handleComplete = useCallback(
        (item: IExampleItemState) => {
            setEditId(undefined)
        },
        []
    );

    return (
        <ListContainer ref={forwardedRef}>
            [{inViewport ? "YES": "NO"}]
            {hasError && `Error occurred: ${error && error.message}`}
            <Loading loading={processing}>
                {!complete ?
                    <Placeholder>
                        <ListItem>xxx</ListItem>
                        <ListItem>xxx</ListItem>
                        <ListItem>xxx</ListItem>
                    </Placeholder>
                    :
                    <ListItems>
                        {items.map(item => (
                            <ListItem key={item.id}>
                                <Item
                                    item={item}
                                    isEditing={editId === item.id}
                                    onChange={onExampleEditItem}
                                    onEdit={handleEdit}
                                    onComplete={handleComplete}
                                />
                            </ListItem>
                        ))}
                    </ListItems>
                }
            </Loading>
        </ListContainer>
    )
}

export default React.memo<ListProps>(handleViewport(List, {}, {disconnectOnLeave: true}));
