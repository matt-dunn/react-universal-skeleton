import {useEffect} from "react";

let context = {};

const useAction = (cb, id) => {
    if (process.browser) {
        return useEffect(cb, []);
    } else {
        if (!context[id]) {
            context[id] = cb
        }
    }
}

const getContext = () => context;

const endContext = () => context = {};

export {useAction, getContext, endContext};
