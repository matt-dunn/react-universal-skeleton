import React, {useEffect, useContext, useRef} from "react";
import isPromise from 'is-promise';

import {APIContext, ErrorContext, FoldContext} from "./contexts";

const usePerformAction = (action, test, deps = []) => {
    const {handleError} = useContext(ErrorContext) || {};
    const {processOnServer = false} = useContext(FoldContext) || {};

    if (process.browser) {
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
        }, deps);
    } else if (processOnServer) {
        const context = useContext(APIContext);

        if (context) {
            const payload = action();

            if (isPromise(payload)) {
                context.push(
                    payload
                        .catch(ex => {
                            if (handleError && handleError(ex) === true) {   // Handled errors should throw on the server so getDataFromTree will immediately bail
                                throw ex;
                            }

                            console.error(ex);
                        })
                );
            }
        }
    }

}

export default usePerformAction;
