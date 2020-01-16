import React, {useCallback, useState, useRef, useEffect} from "react";
import styled from "@emotion/styled";
import {css} from "@emotion/core";

import TextInput from "react-responsive-ui/modules/TextInput";

// import Status from "components/state-mutate-with-status/status";
import useAutosave from "components/hooks/useAutosave";

import {ExampleItemState} from "../../reducers/__dummy__/example";
import {ExampleResponse} from "../api/__dummy__/example";

import useWhatChanged from "components/whatChanged/useWhatChanged";
// import {withWireFrameAnnotation} from "components/Wireframe";

export type ItemProps = {
    item: ExampleItemState;
    onChange?: (item: ExampleItemState) => Promise<ExampleResponse>;
    type?: "primary" | "secondary";
    className?: string;
    disabled?: boolean;
};

const Container = styled.div<{type?: string}>`
  display: flex;
  ${({type}) => type === "primary" && css`border: 1px dashed #ccc; padding: 5px;margin-bottom: 5px;`}
`;

const Value = styled(TextInput)`
  margin: 10px 0;
  width: 100%;
  
  .rrui__input-field {
    &, &:focus {
      background-color: transparent;
    }
  }
`;

const Saving = styled.div`
  font-size: 10px;
`;

const Item = ({item, onChange, type, className, disabled}: ItemProps) => {
    const {name/*, $status*/} = item;
    // const {complete, isActive, processing, hasError, error, lastUpdated} = Status($status);

    const [value, setValue] = useState(name);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setValue(name);
    }, [name]);

    const inputEl = useRef<HTMLInputElement>(null);

    const save = useAutosave(onChange, {
        onSaving: () => setSaving(true),
        onComplete: () => setSaving(false),
    });

    const handleChange = useCallback(
        newValue => {
            if (newValue !== value) {
                setValue(newValue);

                save && save({...item, name: newValue})
                    .then(a => console.log("SAVE COMPLETE", a.name));
            }
        },
        [item, save, value]
    );

    useWhatChanged(Item, {saving, inputEl, item, onChange, value, handleChange, disabled, save}, {idProp: "item.id"});

    return (
        <div className={className}>
            <Container type={type}>
                <Value
                    multiline
                    label="Item"
                    value={value}
                    disabled={disabled}
                    onChange={handleChange}
                />
            </Container>
            {saving &&
                <Saving>
                    Saving...
                </Saving>
            }
        </div>
    );
};

Item.displayName = "Items.Item";

export default React.memo<ItemProps>(Item);

// export default React.memo<ItemProps>(withWireFrameAnnotation<ItemProps>(Item, {
//     description: "Editable item"
// }));
