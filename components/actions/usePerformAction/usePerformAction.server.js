import {useContext} from "react";
import isPromise from "is-promise";

import {useSafePromiseWithEffect} from "components/ssr/safePromise";

import {ErrorContext, ErrorHandlerContext, FoldContext} from "../contexts";

const usePerformAction = action => {
    const {handleError} = useContext(ErrorHandlerContext) || {};
    const {processOnServer = false} = useContext(FoldContext) || {};

    const safePromise = useSafePromiseWithEffect();
    const errorContext = useContext(ErrorContext);

    if (processOnServer && safePromise) {
        const payload = action();

        if (isPromise(payload)) {
            safePromise(
                payload
                    .catch(ex => {
                        if (handleError) {
                            const ret = handleError(ex);

                            if (ret !== false && ret !== true && ret) {
                                errorContext.error = ex;
                                throw ex;
                            }

                            if (ret === true) {   // Handled errors should throw on the server so getDataFromTree will immediately bail
                                throw ex;
                            }
                        }

                        console.error(ex);
                    })
            );
        }
    }
};

export default usePerformAction;
