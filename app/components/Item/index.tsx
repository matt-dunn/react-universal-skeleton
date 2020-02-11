import styled from "@emotion/styled";
import {css} from "@emotion/core";
import React, {useCallback} from "react";

import Loading from "components/Loading";
import {usePerformAction} from "components/actions";
import {getStatus, DecoratedWithStatus} from "components/state-mutate-with-status";
import PlaceHolderItem from "app/components/Placeholder/Item";

import useWhatChanged from "components/whatChanged/useWhatChanged";
import {withWireFrameAnnotation} from "components/Wireframe/withWireFrameAnnotation";

export type Item = {
    id: string;
    name: string;
}

export type GetItem = () => Promise<Item>

type ItemProps = {
    item?: Item & DecoratedWithStatus;
    getItem: GetItem;
    className?: string;
    isShown?: boolean;
};

const ItemContainer = styled.div<{processing?: boolean}>`
    max-width: 400px;
    min-height: 80px;
    border: 1px solid #ccc;
    margin: 10px auto;
    display: flex;
    flex-direction: column;

    .item {
      flex-grow: 1;
      ${({processing}) => processing && css`
        background-color: rgba(210,210,210,0.1);
      `};
      padding: 10px;
    }
`;

const PlaceHolderListItem = PlaceHolderItem(styled.div`color:#ddd`);


const Item = ({className, isShown = true, item, getItem, ...props}: ItemProps) => {
    const {complete, processing, hasError, error} = getStatus(item);

    useWhatChanged(Item, { className, isShown, item, getItem, ...props });

    const itemId = item && item.id;

    usePerformAction(
        getItem,
        useCallback(() => isShown && !itemId, [isShown, itemId])
    );

    return (
        <ItemContainer className={className} processing={processing}>
            <div style={{color: "#aaa", fontSize: "9px", padding: "4px", borderBottom: "1px solid #eee"}}>
                [{processing ? "UPDATING": "DONE"}]
                {hasError && `Error occurred: ${error && error.message}`}
            </div>
            <Loading loading={processing} className="item">
                {!complete ?
                    <PlaceHolderListItem/>
                    :
                    <div>{item && item.name}</div>
                }
            </Loading>
        </ItemContainer>
    );
};

// export default React.memo<ItemProps>(Item);

export default React.memo<ItemProps>(withWireFrameAnnotation<ItemProps>(Item, {
    title: <div><strong>Simple</strong> item</div>,
    description: <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam iaculis convallis ante, ac porttitor eros hendrerit non. Ut a hendrerit ligula. Praesent vestibulum, dui venenatis convallis condimentum, lorem magna rutrum erat, eget convallis odio purus sed ex. Suspendisse congue metus ac blandit vehicula. Suspendisse non elementum purus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
}));
