import React, {useCallback, useState, useRef, useEffect} from "react";
import styled, {css} from "styled-components";
import ContentEditable, {ContentEditableEvent} from 'react-contenteditable'

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
  word-break: break-word;
`

const Value = styled(ContentEditable)`
  ${valueStyle};

  &[contenteditable=true] {
    background-color: #eee;
    outline: none;
  }
`;

const Item = ({item, isEditing = false, onChange, onComplete, onEdit}: ItemProps) => {
    const {id, name, $status} = item;
    const {complete, isActive, processing, hasError, error} = Status($status);

    const [value, setValue] = useState(name);

    useEffect(() => {
        setValue(name)
    }, [name])

    const inputEl = useRef<HTMLInputElement>(null);

    const save = onChange && useAutosave(onChange);

    const handleChange = useCallback(
        ({target: {value: v}}: ContentEditableEvent) => {
            if (v !== value) {
                setValue(v);

                save && save({...item, name: v})
                    .then(a => console.log("SAVE COMPLETE", a.name))
            }
        },
        []
    );

    const handleEdit = useCallback(
        () => {
            !isEditing && onEdit && onEdit(item);
        },
        [isEditing]
    );

    const handleBlur = useCallback(
        () => {
            isEditing && onComplete && onComplete(item);
        },
        [isEditing]
    );

    useEffect(() => {
        if (isEditing && inputEl && inputEl.current) {
            inputEl.current.focus();
        }
    }, [isEditing]);


    useWhatChanged(Item, {inputEl, item, isEditing, onChange, onComplete, onEdit, value, handleChange, handleEdit, handleBlur, save}, {idProp: "item.id"});

    return (
        <Container
            onClick={handleEdit}
        >
            <label htmlFor={item.id}>
            ITEM:
            </label>

            <Value
                id={item.id}
                innerRef={inputEl}
                html={value}
                disabled={!isEditing}
                tagName='article'
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </Container>
    )
}

Item.displayName = "Items.Item";

export default React.memo<ItemProps>(Item);
