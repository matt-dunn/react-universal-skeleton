import {useEffect, useContext, useRef} from "react";
import isPromise from "is-promise";

import {ErrorHandlerContext, FoldContext} from "../contexts";

const usePerformAction = (action, test) => {
    const {handleError} = useContext(ErrorHandlerContext) || {};
    const {processOnServer = false} = useContext(FoldContext) || {};

    const skipInitial = useRef((processOnServer && window.__PRERENDERED_SSR__) || false);

    useEffect(() => {
        if (!skipInitial.current && (!test || test())) {
            const payload = action();

            if (isPromise(payload)) {
                payload
                    .catch(ex => {
                        if (handleError && handleError(ex) === true) {   // Handled errors should not throw on client
                            console.error(ex);
                            return;
                        }

                        throw ex;
                    });
            }
        }

        skipInitial.current = false;
    }, [action, test, handleError, processOnServer]);
};

export default usePerformAction;
