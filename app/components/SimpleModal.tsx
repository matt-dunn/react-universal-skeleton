import React from "react";

import {Notify} from "components/notification";
import {DecoratedWithStatus, getStatus} from "components/state-mutate-with-status";
import {ModalFooter, ModalTitle, WithModalProps} from "components/Modal";
import {Button, ButtonGroup, ButtonSimple, ButtonSimplePrimary} from "components/Buttons";
import {withWireFrameAnnotation} from "components/Wireframe/withWireFrameAnnotation";

import SimpleItem, {GetItem, Item} from "app/components/Item";

const WAModalButton = withWireFrameAnnotation(Button, {
    title: <div>Modal focusable item</div>,
    description: <div>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const WAModalSubmit = withWireFrameAnnotation(ButtonSimplePrimary, {
    title: <div>Modal submit button</div>,
    description: <div>Only enabled once the data is available.</div>
});

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
            <SimpleItem isShown={true} item={item} getItem={getItem}/>
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
