import React from "react";
import {ObjectSchemaDefinition, Schema, SchemaDescription} from "yup";
import styled from "styled-components";
import {get} from "lodash";

import useWhatChanged from "components/whatChanged/useWhatChanged";

interface Field extends SchemaDescription {
    tests: Array<{ name: string; params: object; OPTIONS: {name: string} }>;
}

type FormLabelProps<T> = {
    label: string;
    name: string;
    field: Field;
}

const Label = styled.label`
  color: #666;
  margin: 2px 0;
  display: block;
`

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
`

const typedMemo: <T>(c: T) => T = React.memo;

const FormLabel = typedMemo(function<T>({label, name, field}: FormLabelProps<T>) {
    useWhatChanged(FormLabel, { FormLabel, label, field });

    return (
        <Label htmlFor={name as string}>
            {label}
            {field && field.tests.filter(test => test.OPTIONS.name === "required").length > 0 && <LabelIsRequired> is required</LabelIsRequired>}
        </Label>
    );
});

export default FormLabel;
