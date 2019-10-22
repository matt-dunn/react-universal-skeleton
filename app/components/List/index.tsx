import React, {ReactNode, useCallback, useRef} from "react";
import styled, {css} from "styled-components";
import { Link } from 'react-router-dom';

import Status, {IStatus} from "components/state-mutate-with-status/status";
import Loading from "components/Loading";
import {usePerformAction} from "components/actions";

import {IExampleItemState} from "../../reducers/__dummy__/example";
import {ExampleEditItem, IExampleGetList} from "../api/__dummy__/example";
import PlaceHolderItem from "app/components/Placeholder/Item";

import Item from "../EditItem";

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
    children?: (item: IExampleItemState) => JSX.Element;
};

const ListContainer = styled.div`
    /*max-width: 700px;*/
    border: 1px solid #ccc;
    margin: 10px auto;
`;

const list = css`
    min-height: 100px;
`;


const calculateMaxChildren = (children: ReactNode[], dimensions?: ViewportDimensions, minWidth?: number) => {
    const {width} = dimensions || {};

    if (width && minWidth && width / children.length < minWidth) {
        return Math.floor(width / minWidth);
    }

    return children.length;
}

const ListItems = styled.ol<{children: ReactNode[]; dimensions?: ViewportDimensions; minWidth?: number}>`
    display: flex;
    ${list};
    
    flex-wrap: wrap;
    
    > li {
      ${({children, dimensions, minWidth}) => {
        const length = calculateMaxChildren(children, dimensions, minWidth);
        return css`
          width: calc(${`${100 / length}%`} - 20px);
          &:nth-child(${length}n) {
            border-right: none;
          }
        `;
      }}
    }

    /*@media only screen and (max-width: 500px) {
      flex-direction: column;
      
      > li {
        width: initial;
      }
    }*/
`;

const ListItem = styled.li`
    padding: 10px;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin: 0 -1px -1px 0;

    /*
    &:last-child {
        border-right: none;
    }

    @media only screen and (max-width: 500px) {
        border-right: none;
        border-bottom: 1px solid #eee;

        &:last-child {
            border-bottom: none;
        }
    }
     */
`;

const Placeholder = styled(ListItems)`
    color: #ccc;
    text-align: center;
`;

const PlaceHolderListItem = PlaceHolderItem(ListItem);

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

const MAX_ITEMS = 5;

import useViewportWidth, {ViewportDimensions} from "components/hooks/useViewportWidth";

const List = ({isShown = true, items, $status, onExampleGetList, onExampleEditItem, activePage, children, ...props}: ListProps) => {
    const {complete, isActive, processing, hasError, error, outstandingTransactionCount} = Status(items.$status);

    const container = useRef();

    const dimensions = useViewportWidth(container);

    usePerformAction(
        useCallback(() => {
            return onExampleGetList(activePage, MAX_ITEMS)
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

    useWhatChanged(List, { container, dimensions, activePage, isShown, items, $status, onExampleGetList, onExampleEditItem, children, usePerformAction, ...props });

    return (
        <ListContainer ref={container as any}>
            <div style={{color: "#aaa", fontSize: "9px", padding: "4px", borderBottom: "1px solid #eee"}}>
                [{!processing && outstandingTransactionCount > 0 ? "CHILDREN UPDATING": "CHILDREN DONE"}]
                [{processing ? "UPDATING": "DONE"}]
                {hasError && `Error occurred: ${error && error.message}`}
            </div>
            <Loading loading={processing}>
                {(!items || items.length === 0) ?
                    <Placeholder dimensions={dimensions} minWidth={200}>
                        {Array.from(Array(MAX_ITEMS).keys()).map(i => <PlaceHolderListItem key={i}/>)}
                    </Placeholder>
                    :
                    <ListItems dimensions={dimensions} minWidth={200}>
                        {items.map(item => (
                            <ListItem key={item.id}>
                                {(children && children(item)) ||
                                <Item
                                    item={item}
                                    onChange={onExampleEditItem}
                                />
                                }
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

export default React.memo<ListProps>((List));
