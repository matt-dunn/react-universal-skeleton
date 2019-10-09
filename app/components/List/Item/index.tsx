import React, {useCallback, useState, useRef, useEffect} from "react";
import styled, {css} from "styled-components";

import Status from "components/state-mutate-with-status/status";
import useAutosave from "components/hooks/useAutosave";

import {IExampleItemState} from "../../../reducers/__dummy__/example";
import {IExampleResponse} from "../../api/__dummy__/example";

import useWhatChanged from "components/whatChanged/useWhatChanged";

export type ItemProps = {
    item: IExampleItemState;
    isEditing?: boolean;
    onEdit?: (item: IExampleItemState) => void;
    onChange?: (item: IExampleItemState) => Promise<IExampleResponse>;
    onComplete?: (item: IExampleItemState) => void;
};

const Container = styled.div`
  display: flex;
`;

const valueStyle = css`
  font-size: inherit;
  border: none;
  font-weight: inherit;
  font-family: inherit;
  padding: 0;
  flex-grow: 1;
`

const Value = styled.div`
  ${valueStyle};
`;

const Input = styled.input`
  ${valueStyle};
  background-color: #eee;
  outline: none;
`;

const Item = ({item, isEditing = false, onChange, onComplete, onEdit}: ItemProps) => {
    const {id, name, $status} = item;
    const {complete, isActive, processing, hasError, error} = Status($status);

    const [value, setValue] = useState(name);

    const inputEl = useRef<HTMLInputElement>(null);

    const save = onChange && useAutosave(onChange);

    const handleChange = useCallback(
        ({currentTarget: {value}}: React.FormEvent<HTMLInputElement>) => {
            setValue(value);

            save && save({...item, name: value})
                .then(a => console.log("SAVE COMPLETE", a.name))
        },
        []
    );

    const handleEdit = useCallback(
        () => {
            onEdit && onEdit(item);
        },
        []
    );

    const handleBlur = useCallback(
        () => {
            onComplete && onComplete(item);
        },
        []
    );

    useEffect(() => {
        if (isEditing && inputEl && inputEl.current) {
            inputEl.current.focus();
        }
    }, [isEditing]);


    useWhatChanged(Item, {item, isEditing, onChange, onComplete, onEdit, value, handleChange, handleEdit, handleBlur, save}, {idProp: "item.id"});

    return (
        <Container
            onClick={handleEdit}
        >
            <label htmlFor={item.id}>
            ITEM:
            </label>
            {isEditing ?
                <Input
                    id={item.id}
                    ref={inputEl}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                :
                <Value>
                    {name}
                </Value>
            }
        </Container>
    )
}

Item.displayName = "Items.Item";

export default React.memo<ItemProps>(Item);
