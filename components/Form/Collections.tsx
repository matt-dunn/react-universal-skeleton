import React from "react";

import {FieldSetMap, typedMemo} from "./types";
import {FieldSet} from "./FieldSet";

type CollectionsProps<T, P, S> = {
    fieldsetMap: FieldSetMap<T>;
}

function Collections<T, P, S>({fieldsetMap}: CollectionsProps<T, P, S>) {
    return (
        <>
            {Object.keys(fieldsetMap).map(key => (
                <FieldSet
                    key={key}
                    fields={fieldsetMap[key]}
                />
            ))}
        </>
    );
}

const MemoCollections = typedMemo(Collections);

export {MemoCollections as Collections};
