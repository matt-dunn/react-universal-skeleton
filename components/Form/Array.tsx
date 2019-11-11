import React, {useContext, useMemo} from "react";
import {Schema, string} from "yup";
import {ErrorMessage, FieldArray, getIn, useFormikContext} from "formik";
import classnames from "classnames";

import {FormContext, getDefault} from "./utils";
import {FieldSetWrapper} from "./FieldSetWrapper";
import {Field, FieldSetChildren, typedMemo} from "./types";

export type ArrayProps<T, P, S> = {
    field: Schema<T> & Field<T>;
    path: string;
    children?: FieldSetChildren<T, P, S>;
    className?: string;
}

function Array<T, P, S>({field, path, children, className}: ArrayProps<T, P, S>) {
    const {schema} = useContext(FormContext) || {};
    const {values, errors, isSubmitting, setFieldError} = useFormikContext<T>();
    const value: string[] = getIn(values, path);
    const {label} = field.describe();
    const {itemLabel} = field._meta;
    const error = getIn(errors, path);

    const {min, max} = useMemo(() => field.tests.reduce((o: {min: number; max: number | undefined}, test: { OPTIONS: {name: string; params: any }}) => {
        if (test.OPTIONS.name === "min") {
            o.min = test.OPTIONS.params.min;
        } else if (test.OPTIONS.name === "max") {
            o.max = test.OPTIONS.params.max;
        }
        return o;
    }, {min: 0, max: undefined}), [field.tests]);

    const itemsCount = (value && value.length) || 0;

    return schema && (
        <FieldArray
            name={path}
            render={arrayHelpers => {
                const AddOption = ((!max || itemsCount < max) && (
                    <button
                        disabled={isSubmitting}
                        name="@@ADD_ITEM"
                        value={path}
                        type="submit"
                        onClick={e => {
                            e.preventDefault();
                            arrayHelpers.push(getDefault(schema, path));
                            value && value.length === 0 && setFieldError(path as keyof T & string, undefined as any);
                        }}
                    >
                        Add {itemLabel || label}
                    </button>
                )) || null;

                return (
                    <fieldset
                        className={classnames("subSectionContainer", className)}
                    >
                        {label && <legend>{label}</legend>}

                        {typeof error === "string" &&
                        <ErrorMessage name={path}>
                            {message => <label className="feedback"><em>{message}</em></label>}
                        </ErrorMessage>
                        }

                        {value && value.map((value, index) => {
                            const itemFullPath = `${path}.${index}`;
                            const RemoveOption = (itemsCount > min && (
                                <button
                                    disabled={isSubmitting}
                                    name="@@REMOVE_ITEM"
                                    value={itemFullPath}
                                    type="submit"
                                    onClick={e => {
                                        e.preventDefault();
                                        arrayHelpers.remove(index)
                                    }}
                                >
                                    Remove {itemLabel || label}
                                </button>
                            )) || null;

                            const InsertOption = ((!max || itemsCount < max) && (
                                <button
                                    disabled={isSubmitting}
                                    name="@@INSERT_ITEM"
                                    value={itemFullPath}
                                    type="submit"
                                    onClick={e => {
                                        e.preventDefault();
                                        arrayHelpers.insert(index, getDefault(schema, path))
                                    }}
                                >
                                    Insert {itemLabel || label}
                                </button>
                            )) || null;

                            return (
                                <fieldset
                                    key={itemFullPath}
                                    className="subSection"
                                >
                                    {(max && max > 1) && <legend>{itemLabel || label} {index + 1}</legend>}
                                    <FieldSetWrapper
                                        fields={field._subType.fields}
                                        path={itemFullPath}
                                    >
                                        {children}
                                    </FieldSetWrapper>
                                    {(InsertOption || RemoveOption) && <aside className="options">
                                        {InsertOption}
                                        {RemoveOption}
                                    </aside>}
                                </fieldset>
                            );
                        })}
                        {AddOption && <aside className="options left">
                            {AddOption}
                        </aside>}
                    </fieldset>
                )}}
        />
    ) || null;
}

const MemoArray = typedMemo(Array);

export {MemoArray as Array};
