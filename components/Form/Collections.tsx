import React from "react";

import {FieldSetMap, typedMemo} from "./types";
import {FieldSet} from "./FieldSet";

export type CollectionsProps<T, P, S> = {
    map: FieldSetMap<T>;
}

function Collections<T, P, S>({map}: CollectionsProps<T, P, S>) {
    return (
        <>
            {Object.keys(map).map(key => (
                <FieldSet
                    key={key}
                    fields={map[key]}
                />
            ))}
        </>
    );
}

const MemoCollections = typedMemo(Collections);

export {MemoCollections as Collections};
