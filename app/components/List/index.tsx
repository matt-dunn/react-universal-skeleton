import React, {ReactElement, useCallback} from "react";
import styled from "@emotion/styled";
import {css} from "@emotion/core";
import { Link } from "react-router-dom";

import {getStatus, DecoratedWithStatus} from "components/state-mutate-with-status";
import Loading from "components/Loading";
import {usePerformAction} from "components/actions";
import {ResponsiveGrid} from "components/Grid";

import {ExampleItemState} from "../../reducers/__dummy__/example";
import {ExampleEditItem, ExampleGetList} from "../api/__dummy__/example";
import PlaceHolderItem from "app/components/Placeholder/Item";

import Item from "../EditItem";

import useWhatChanged from "components/whatChanged/useWhatChanged";
import {withWireFrameAnnotation} from "components/Wireframe";

type ExampleItemStateList<T> = Array<T> & DecoratedWithStatus;

export type ListProps = {
    items: ExampleItemStateList<ExampleItemState>;
    onExampleGetList: ExampleGetList;
    onExampleEditItem: ExampleEditItem;
    isShown?: boolean;
    activePage?: number;
    children?: ({item, disabled}: {item: ExampleItemState; disabled: boolean}) => ReactElement<any>;
};

const ListContainer = styled.div`
    /*max-width: 700px;*/
    border: 1px solid #ccc;
    margin: 10px auto;
`;

const ListItems = styled(ResponsiveGrid("ol"))`
    min-height: 150px;
`;

const ListItem = styled.li`
    padding: 10px;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin: 0 -1px -1px 0;
`;

const Placeholder = styled(ListItems)`
    color: #ddd;
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

const MAX_ITEMS = 4;

const WFPagination = withWireFrameAnnotation(Pagination, {
    title: <div>Pagination</div>,
    description: <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam iaculis convallis ante, ac porttitor eros hendrerit non. Ut a hendrerit ligula. Praesent vestibulum, dui venenatis convallis condimentum, lorem magna rutrum erat, eget convallis odio purus sed ex. Suspendisse congue metus ac blandit vehicula. Suspendisse non elementum purus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const List = ({isShown = true, items, onExampleGetList, onExampleEditItem, activePage, children, ...props}: ListProps) => {
    const {processing, hasError, error, outstandingTransactionCount} = getStatus(items);

    usePerformAction(
        useCallback(() => {
            // onExampleGetList(0, 2);
            return onExampleGetList(activePage, MAX_ITEMS);
                // .then(e => {
                //     console.log("DONE", e);
                //     return e;
                // })
                // .catch(ex => {
                //     console.log("ERROR", ex.message);
                //     throw ex;
                // });
        }, [onExampleGetList, activePage]),
        useCallback(() => isShown, [isShown])
    );

    useWhatChanged(List, { activePage, isShown, items, onExampleGetList, onExampleEditItem, children, usePerformAction, ...props });

    return (
        <ListContainer>
            <div style={{color: "#aaa", fontSize: "9px", padding: "4px", borderBottom: "1px solid #eee"}}>
                [{!processing && outstandingTransactionCount > 0 ? "CHILDREN UPDATING": "CHILDREN DONE"}]
                [{processing ? "UPDATING": "DONE"}]
                {hasError && `Error occurred: ${error && error.message}`}
            </div>
            <Loading loading={processing}>
                {(!items || items.length === 0) ?
                    <Placeholder minItemWidth={200} totalPaddingWidth={20}>
                        {Array.from(Array(MAX_ITEMS).keys()).map(i => <PlaceHolderListItem key={i}/>)}
                    </Placeholder>
                    :
                    <ListItems minItemWidth={200} totalPaddingWidth={20}>
                        {items.map(item => (
                            <ListItem key={item.id}>
                                {(children && children({item, disabled: processing})) ||
                                <Item
                                    item={item}
                                    disabled={processing}
                                    onChange={onExampleEditItem}
                                />
                                }
                            </ListItem>
                        ))}
                    </ListItems>
                }
            </Loading>

            <WFPagination disabled={processing}>
                {Array.from(Array(5).keys()).map(page => (
                    <Page
                        key={page}
                        data-id={page}
                    >
                        <PageLink
                            className={(page === activePage && "active") || ""}
                            to={`/data/${page}`}
                        >
                            {page + 1}
                        </PageLink>
                    </Page>
                ))}
            </WFPagination>
        </ListContainer>
    );
};

export default React.memo<ListProps>((List));
