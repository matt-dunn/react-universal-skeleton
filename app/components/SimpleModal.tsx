import React from "react";

import {Notify} from "components/notification";
import {DecoratedWithStatus, getStatus} from "components/state-mutate-with-status";
import {ModalFooter, ModalTitle, WithModalProps} from "components/Modal";
import {Button, ButtonGroup, ButtonSimple, ButtonSimplePrimary} from "components/Buttons";
import {withWireframeAnnotation} from "@matt-dunn/react-wireframes";

import SimpleItem, {GetItem, Item} from "app/components/Item";

const WAModalButton = withWireframeAnnotation({
    title: "Modal focusable item",
    description: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
})(Button);

const WAModalSubmit = withWireframeAnnotation({
    title: "Modal submit button",
    description: "Only enabled once the data is available."
})(ButtonSimplePrimary);

const SimpleModal = ({notify, close, item, getItem}: {notify: Notify; item?: Item & DecoratedWithStatus; getItem: GetItem} & WithModalProps) => {
    const {complete} = getStatus(item);
    const submit = () => {
        notify({message: "Submit..."});
        close();
    };

    return (
        <>
            <address>
                Some content...{" "}
                <WAModalButton
                >
                    Focusable element
                </WAModalButton>
            </address>
            <SimpleItem item={item} getItem={getItem}/>
            <ModalFooter>
                <ButtonGroup>
                    <ButtonSimple
                        onClick={close}
                    >
                        Cancel
                    </ButtonSimple>
                    <WAModalSubmit
                        onClick={submit}
                        disabled={!item || !complete}
                    >
                        Submit
                    </WAModalSubmit>
                </ButtonGroup>
            </ModalFooter>
            <ModalTitle hasClose={true}>Test Modal With Data</ModalTitle>
            More content...
        </>
    );
};

export default SimpleModal;
