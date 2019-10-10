import React, {useEffect, useContext, useRef} from "react";
import isPromise from 'is-promise';

import {ErrorHandlerContext, FoldContext} from "../contexts";

const usePerformAction = (action, test, deps = []) => {
    const {handleError} = useContext(ErrorHandlerContext) || {};
    const {processOnServer = false} = useContext(FoldContext) || {};

    const isCalled = useRef(false);

    useEffect(() => {
        if ((!processOnServer || !window.__PRERENDERED_SSR__) && (!test || test()) && !isCalled.current) {
            isCalled.current = true;

            const payload = action();

            if (isPromise(payload)) {
                payload
                    .catch(ex => {
                        if (handleError && handleError(ex) === true) {   // Handled errors should not throw on client
                            console.error(ex);
                            return;
                        }

                        throw ex;
                    })
            }
        }
    }, [action, handleError, processOnServer, test, ...deps]);
}

export default usePerformAction;
