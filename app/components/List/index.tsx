import React, {ReactNode, useCallback} from "react";
import styled, {css} from "styled-components";
import { Link } from 'react-router-dom';

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
    isShown?: boolean;
    activePage?: number;
};

const ListContainer = styled.div`
    max-width: 700px;
    border: 1px solid #ccc;
    margin: 10px auto;
`;

const list = css`
    min-height: 100px;
`;

const ListItems = styled.ol<{children: ReactNode[]}>`
    display: flex;
    ${list}
    
    li {
      width: ${({children}) => (children && `${100 / children.length}%`) || 0};
    }
`;

const ListItem = styled.li`
    padding: 10px;
    border-right: 1px solid #eee;

    &:last-child {
        border-right: none;
    }
`;

const Placeholder = styled(ListItems)`
    color: #ccc;
    text-align: center;
`;

const PlaceHolderItem = styled(ListItem)`
  position: relative;

  &:before {
    position: absolute;
    left: 10px;
    top: 10px;
    background-color: rgba(222, 226, 230, 0.4);
    border-radius: 0.25rem;
    width: 55%;
    height: 0.75em;
    content: " ";
  }

  &:after {
    position: absolute;
    left: 10px;
    top: 10px;
    margin-top: 1.1em;
    background-color: rgba(222, 226, 230, 0.4);
    border-radius: 0.25rem;
    width: 85%;
    height: 1em;
    content: " ";
  }
`;

const Pagination = styled.ol<{disabled?: boolean}>`
  display: flex;
  justify-content: center;
  color: #888;
  border-top: 3px solid #eee;

  ${({disabled}) => disabled && css`
    color: #ccc;
    pointer-events:none;
  `};
`;

const Page = styled.li`
  padding: 5px;
  display: flex;
  align-self: center;
`;

const PageLink = styled(Link)`
  text-decoration: none;
  font-size: 0.8em;
  
  &.active {
    font-size: 1em;
    font-weight: bold;
    color: #222;
    pointer-events:none;
    cursor: default;
  }
`;

const List = ({isShown = true, items, $status, onExampleGetList, onExampleEditItem, activePage, ...props}: ListProps) => {
    const {complete, isActive, processing, hasError, error, outstandingTransactionCount} = Status(items.$status);

    usePerformAction(
        useCallback(() => {
            return onExampleGetList(activePage)
                .then(e => {
                    console.log("DONE", e)
                    return e;
                })
                .catch(ex => {
                    console.log("ERROR", ex.message)
                    throw ex;
                })
        }, [onExampleGetList, activePage]),
        useCallback(() => isShown, [isShown])
    );

    useWhatChanged(List, { activePage, isShown, items, $status, onExampleGetList, onExampleEditItem, usePerformAction, ...props });

    return (
        <ListContainer>
            <div style={{color: "#aaa", fontSize: "9px", padding: "4px", borderBottom: "1px solid #eee"}}>
                [{!processing && outstandingTransactionCount > 0 ? "CHILDREN UPDATING": "CHILDREN DONE"}]
                [{processing ? "UPDATING": "DONE"}]
                {hasError && `Error occurred: ${error && error.message}`}
            </div>
            <Loading loading={processing}>
                {(!items || items.length === 0) ?
                    <Placeholder>
                        <PlaceHolderItem/>
                        <PlaceHolderItem/>
                        <PlaceHolderItem/>
                    </Placeholder>
                    :
                    <ListItems>
                        {items.map(item => (
                            <ListItem key={item.id}>
                                <Item
                                    item={item}
                                    onChange={onExampleEditItem}
                                />
                            </ListItem>
                        ))}
                    </ListItems>
                }
            </Loading>

            <Pagination disabled={processing}>
                {Array.from(Array(5).keys()).map(page => (
                    <Page
                        key={page}
                        data-id={page}
                    >
                        <PageLink
                            className={(page === activePage && "active") || ""}
                            to={`/about/${page}`}
                        >
                            {page + 1}
                        </PageLink>
                    </Page>
                ))}
            </Pagination>
        </ListContainer>
    )
}

export default React.memo<ListProps>(List);
