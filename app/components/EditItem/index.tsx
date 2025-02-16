import React, {useCallback, useState, useRef, useEffect} from "react";
import styled from "@emotion/styled";
import {css} from "@emotion/core";
import TextInput from "react-responsive-ui/modules/TextInput";

import {getStatus, DecoratedWithStatus} from "components/state-mutate-with-status";

import useWhatChanged from "components/whatChanged/useWhatChanged";

export type EditItem = {
    id: string;
    name: string;
}

export type OnChange = (item: EditItem) => Promise<EditItem>

type EditItemProps = {
    item: EditItem & DecoratedWithStatus;
    onChange?: OnChange;
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

const Message = styled.div`
  font-size: 10px;
`;

export const EditItem = ({item, onChange, type, className, disabled}: EditItemProps) => {
    const {name} = item;
    const {processing, error} = getStatus(item);

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

    useWhatChanged(EditItem, {inputEl, item, onChange, value, handleChange, disabled}, {idProp: "item.id"});

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
            <Message>
                Saving...
            </Message>
            }

            {error &&
            <Message>
                {error.message}
            </Message>
            }
        </div>
    );
};

export default React.memo<EditItemProps>(EditItem);
