import React, {useMemo} from "react";
import styled from "@emotion/styled";

import {DecoratedWithStatus} from "components/state-mutate-with-status";
import {useModal} from "components/Modal";
import {Button, ButtonGroup} from "components/Buttons";
import {withWireframeAnnotation} from "@matt-dunn/react-wireframes";
import {Notify} from "components/notification";

import SimpleItem, {GetItem, Item} from "app/components/Item";

import useWhatChanged from "components/whatChanged/useWhatChanged";
import SimpleModal from "./SimpleModal";

type ModalsProps = {
    item?: Item & DecoratedWithStatus;
    getItem: GetItem;
    notify: Notify;
};

const ModalOptions = styled(ButtonGroup)`
  margin: 20px 0;
`;

const WSButtons = withWireframeAnnotation({
    title: "Open modal CTA",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam iaculis convallis ante, ac porttitor eros hendrerit non. Ut a hendrerit ligula. Praesent vestibulum, dui venenatis convallis condimentum, lorem magna rutrum erat, eget convallis odio purus sed ex. Suspendisse congue metus ac blandit vehicula. Suspendisse non elementum purus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
})(ModalOptions);

const Modals = ({notify, item, getItem}: ModalsProps) => {
    const modalProps = useMemo(() => {
        return {
            item,
            getItem,
            notify
        };
    }, [item, getItem, notify]);

    const [modal, open] = useModal(modalProps);

    const openTest1 = () => open(SimpleItem)
        .then(() => {
            console.log("CLOSED 1...");
        });

    const openTest2 = () => open(SimpleModal, {isStatic: true})
        .then(() => {
            console.log("CLOSED 2...");
        });

    useWhatChanged(Modals, { modal, open, item, getItem});

    return (
        <>
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
        </>
    );
};

export default React.memo(Modals);
