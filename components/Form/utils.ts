import React from "react";
import * as Yup from 'yup';
import {Schema} from "yup";
import {SchemaWithFields} from "./types";

export const getDefault = (schema: Schema<any>, path = "") => {
    const pathSchema = Yup.reach(schema, path);

    return ((pathSchema as any)._type === "array" && (Yup.reach(schema, path) as any)._subType.getDefault()) || (pathSchema as any).getDefault()
};

export type FormContext = {
    schema: SchemaWithFields<any>
}

export const FormContext = React.createContext<FormContext | undefined>(undefined);

