import React from "react";
import styled from "styled-components";

import useWhatChanged from "components/whatChanged/useWhatChanged";
import {Field} from "./types";

type FormLabelProps<T> = {
    label: string;
    name: string;
    field: Field<T>;
}

const Label = styled.label`
  color: #666;
  margin: 2px 0;
  display: block;
`;

const LabelIsRequired = styled.span`
  color: red;
  text-indent: -900em;
  overflow: hidden;
  display: inline-block;

  &:before {
    float: left;
    content: '*';
    margin-left: 2px;
    text-indent: 0;
  }
`;

const typedMemo: <T>(c: T) => T = React.memo;

const FormLabel = typedMemo(function<T>({label, name, field}: FormLabelProps<T>) {
    useWhatChanged(FormLabel, { FormLabel, label, field });

    return (
        <Label htmlFor={name as string}>
            {label}
            {field && field.tests.filter(test => test.OPTIONS.name === "required").length > 0 && <LabelIsRequired aria-label="required"> is required</LabelIsRequired>}
        </Label>
    );
});

export default FormLabel;
