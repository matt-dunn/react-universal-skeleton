import styled from "styled-components";
import React from "react";
import handleViewport, {ReactInViewportProps} from "react-in-viewport";

import Loading from "components/Loading";
import {usePerformAction} from "components/actions";
import Status, {IStatus} from "components/state-mutate-with-status/status";

import {IExampleItemState} from "../../reducers/__dummy__/example";
import {IExampleGetItem} from "../api/__dummy__/example";

import useWhatChanged from "components/whatChanged/useWhatChanged";

export type ItemProps = {
    item?: IExampleItemState;
    onExampleGetItem: IExampleGetItem;
    $status?: IStatus;
    className?: string;
};

const ItemContainer = styled.div`
    max-width: 400px;
    border: 1px solid #ccc;
    margin: 10px auto;
    padding: 10px;
`

const Item = ({className, forwardedRef, inViewport = true, item, onExampleGetItem}: ItemProps & ReactInViewportProps) => {
    const {complete, isActive, processing, hasError, error} = (item && Status(item.$status)) || {} as IStatus;

    useWhatChanged(Item, { className, forwardedRef, inViewport, item, onExampleGetItem });

    usePerformAction(
        () => onExampleGetItem(),
        () => inViewport && !complete,
        [inViewport, complete]
    );

    return (
        <ItemContainer ref={forwardedRef} className={className}>
            [{inViewport ? "YES": "NO"}]
            {hasError && `Error occurred: ${error && error.message}`}
            <Loading loading={processing}>
                {!complete ?
                    <div>xxx</div>
                    :
                    <div className="item">{item && item.name}</div>
                }
            </Loading>
        </ItemContainer>
    )
}

export default React.memo<ItemProps>(handleViewport(Item, {}, {disconnectOnLeave: true}));
