import React, {useContext} from "react";
import isPromise from 'is-promise';

import {APIContext, ErrorContext, ErrorHandlerContext, FoldContext} from "../contexts";

const usePerformAction = action => {
    const {handleError} = useContext(ErrorHandlerContext) || {};
    const {processOnServer = false} = useContext(FoldContext) || {};

    const context = useContext(APIContext);
    const errorContext = useContext(ErrorContext)

    if (processOnServer && context) {
        const payload = action();

        if (isPromise(payload)) {
            context.push(
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
}

export default usePerformAction;
