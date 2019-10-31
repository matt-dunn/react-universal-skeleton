import React from "react";
import {Schema} from "yup";
import styled from "styled-components";
import {get} from "lodash";

import useWhatChanged from "components/whatChanged/useWhatChanged";

type Field = {
    tests: Array<{ name: string; params: object; OPTIONS: {name: string} }>
}

type Fields<T> = {
    [Key in keyof T]: Field;
}

interface SchemaWithFields<T> extends Schema<T> {
    fields?: Fields<T>;
}

type FormLabelProps<T> = {
    label: string;
    name: string;
    schema: SchemaWithFields<T>;
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

const FormLabel = typedMemo(function<T>({label, name, schema}: FormLabelProps<T>) {
    const field: Field = get(schema.fields, name.split(".").join(".fields."));

    useWhatChanged(FormLabel, { FormLabel, label, schema });

    return (
        <Label htmlFor={name as string}>
            {label}
            {field && field.tests.filter(test => test.OPTIONS.name === "required").length > 0 && <LabelIsRequired> is required</LabelIsRequired>}
        </Label>
    );
});

export default FormLabel;
