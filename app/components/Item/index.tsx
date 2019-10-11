import styled, {css} from "styled-components";
import React, {useCallback} from "react";

import Loading from "components/Loading";
import {usePerformAction} from "components/actions";
import Status, {IStatus} from "components/state-mutate-with-status/status";

import {IExampleItemState} from "../../reducers/__dummy__/example";
import {IExampleGetItem} from "../api/__dummy__/example";

import useWhatChanged from "components/whatChanged/useWhatChanged";

export type ItemProps = {
    item?: IExampleItemState;
    onExampleGetItem: IExampleGetItem;
    className?: string;
    isShown?: boolean;
};

const ItemContainer = styled.div<{processing?: boolean}>`
    max-width: 400px;
    border: 1px solid #ccc;
    margin: 10px auto;

    .item {
      ${({processing}) => processing && css`
        background-color: orange;
      `}
      padding: 10px;
    }
`

const Item = ({className, isShown = true, item, onExampleGetItem, ...props}: ItemProps) => {
    const {complete, isActive, processing, hasError, error} = (item && Status(item.$status)) || {} as IStatus;

    useWhatChanged(Item, { className, isShown, item, onExampleGetItem, ...props });

    const itemId = item && item.id;

    usePerformAction(
        onExampleGetItem,
        useCallback(() => isShown && !itemId, [isShown, itemId])
    );

    return (
        <ItemContainer className={className} processing={processing}>
            <div style={{color: "#aaa", fontSize: "9px", padding: "4px", borderBottom: "1px solid #eee"}}>
                [{processing ? "UPDATING": "DONE"}]
                {hasError && `Error occurred: ${error && error.message}`}
            </div>
            <Loading loading={processing}>
                {!complete ?
                    <div className="item">xxx</div>
                    :
                    <div className="item">{item && item.name}</div>
                }
            </Loading>
        </ItemContainer>
    )
}

export default React.memo<ItemProps>(Item);
