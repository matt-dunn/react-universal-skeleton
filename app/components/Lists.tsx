import React from "react";
import styled from "@emotion/styled";
import {css} from "@emotion/core";
import TrackVisibility from "react-on-screen";
import { useParams} from "react-router";

import {DecoratedWithStatus} from "components/state-mutate-with-status";
import {AboveTheFold} from "components/actions";

import List, {GetList, Items} from "app/components/List";
import SimpleItem, {GetItem, Item} from "app/components/Item";
import EditItem, {OnChange} from "app/components/EditItem";

import useWhatChanged from "components/whatChanged/useWhatChanged";
import {withWireFrameAnnotation} from "components/Wireframe";

type ListsProps = {
    items: Items;
    item?: Item & DecoratedWithStatus;
    exampleGetList: GetList;
    exampleGetItem: GetItem;
    exampleEditItem: OnChange;
};

const DataListItem = styled(EditItem)<{isImportant?: boolean}>`
  ${({isImportant}) => isImportant && css`background-color: rgba(230, 230, 230, 0.5);`}
`;

const WFList = withWireFrameAnnotation(List, {
    title: <div>Edit list</div>,
    description: <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam iaculis convallis ante, ac porttitor eros hendrerit non. Ut a hendrerit ligula. Praesent vestibulum, dui venenatis convallis condimentum, lorem magna rutrum erat, eget convallis odio purus sed ex. Suspendisse congue metus ac blandit vehicula. Suspendisse non elementum purus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const importantIds = ["item-1", "item-2"];

const Lists = ({items, item, exampleGetList, exampleGetItem, exampleEditItem}: ListsProps) => {
    const { page } = useParams();

    useWhatChanged(Lists, { items, item, exampleGetList, exampleGetItem, exampleEditItem, page});

    return (
        <>
            <AboveTheFold>
                <WFList items={items} getList={exampleGetList} editItem={exampleEditItem} activePage={parseInt(page || "0", 10)}>
                    {({item, disabled}) => (
                        <DataListItem item={item} disabled={disabled} onChange={exampleEditItem} type="primary" isImportant={importantIds.indexOf(item.id) !== -1}/>
                    )}
                </WFList>
            </AboveTheFold>

            <div style={{height: "110vh"}}/>

            <TrackVisibility once={true} partialVisibility={true}>
                {({ isVisible }) => <SimpleItem isShown={isVisible} item={item} getItem={exampleGetItem}/>}
            </TrackVisibility>

            <div style={{height: "10vh"}}/>
        </>
    );
};

export default Lists;
