import React, {useCallback, useState, useRef, useEffect} from "react";
import styled from "@emotion/styled";
import {css} from "@emotion/core";

import TextInput from "react-responsive-ui/modules/TextInput";

import {ExampleItemState} from "../../reducers/__dummy__/example";
import {ExampleResponse} from "../api/__dummy__/example";

import useWhatChanged from "components/whatChanged/useWhatChanged";
import {withWireFrameAnnotation} from "components/Wireframe";
import {getStatus, DecoratedWithStatus} from "components/state-mutate-with-status/status";

export type ItemProps = {
    item: ExampleItemState & DecoratedWithStatus;
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
    const {name} = item;
    const {processing} = getStatus(item);

    const [value, setValue] = useState(name);

    useEffect(() => {
        setValue(name);
    }, [name]);

    const inputEl = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(
        newValue => {
            if (newValue !== value) {
                setValue(newValue);

                onChange && onChange({...item, name: newValue});
            }
        },
        [item, onChange, value]
    );

    useWhatChanged(Item, {inputEl, item, onChange, value, handleChange, disabled}, {idProp: "item.id"});

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
            {processing &&
                <Saving>
                    Saving...
                </Saving>
            }
        </div>
    );
};

Item.displayName = "Items.Item";

// export default React.memo<ItemProps>(Item);

export default React.memo<ItemProps>(withWireFrameAnnotation<ItemProps>(Item, {
    title: <div><strong>Edit</strong> item</div>,
    description: <div>Maecenas eget turpis sit amet orci dictum faucibus pretium eu sapien. Proin rhoncus risus id mollis aliquet. Praesent pellentesque urna et ante rhoncus scelerisque. Proin eget pellentesque quam, non finibus eros. Quisque id arcu eget leo hendrerit vehicula. Suspendisse potenti.</div>
}));
