import * as Yup from 'yup';
import {Schema} from "yup";

export const getDefault = (schema: Schema<any>, path = "") => {
    const pathSchema = Yup.reach(schema, path);

    return ((pathSchema as any)._type === "array" && (Yup.reach(schema, path) as any)._subType.getDefault()) || (pathSchema as any).getDefault()
};

