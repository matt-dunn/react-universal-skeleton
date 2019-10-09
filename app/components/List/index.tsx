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

interface IExampleItemStateList<T> extends Array<T> {
    $status?: IStatus;
}
export type ListProps = {
    items: IExampleItemStateList<IExampleItemState>;
    onExampleGetList: IExampleGetList;
    onExampleEditItem: ExampleEditItem;
    $status?: IStatus;
};

const ListContainer = styled.div`
    max-width: 700px;
    border: 1px solid #ccc;
    margin: 10px auto;
`;

const list = css`
    min-height: 100px;
`;

const ListItemsWrapper = styled.ol`
    display: flex;
    ${list}
`;

const ListItems = ({children, className}: {children: any, className?: string}) => {
    const cols = children.length || 1;

    return (
        <ListItemsWrapper className={className}>
            {React.Children.map(children, (child) => React.cloneElement(child, {
                cols
            }))}
        </ListItemsWrapper>
    )
}

const ListItem = styled.li<{cols?: number;}>`
    padding: 10px;
    width: ${({cols}) => (cols && `${100 / cols}%`) || 0};
    border-right: 1px solid #eee;

    &:last-child {
        border-right: none;
    }
`;

const Placeholder = styled(ListItems)`
    color: #ccc;
    text-align: center;
`

const List = ({forwardedRef, inViewport = true, items, $status, onExampleGetList, onExampleEditItem, ...props}: ListProps & ReactInViewportProps) => {
    const {complete, isActive, processing, hasError, error} = Status(items.$status);

    console.log("#####ITEMS", items)

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

    useWhatChanged(List, { forwardedRef, inViewport, items, $status, onExampleGetList, onExampleEditItem, usePerformAction, handleEdit, handleComplete, editId, ...props });

    return (
        <ListContainer ref={forwardedRef}>
            [{inViewport ? "YES": "NO"}]
            {hasError && `Error occurred: ${error && error.message}`}
            <Loading loading={processing}>
                {(!items || items.length === 0) ?
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
