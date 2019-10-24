import React, {useContext} from "react";
import isPromise from 'is-promise';

import {APIContext, ErrorContext, ErrorHandlerContext} from "../contexts";

const useEffectAction = (action, test) => {
    const {handleError} = useContext(ErrorHandlerContext) || {};

    const context = useContext(APIContext);
    const errorContext = useContext(ErrorContext);

    if ((!test || test()) && context) {
        const payload = action();

        if (isPromise(payload)) {
            context.push(
                payload
                    .catch(ex => {
                        if (handleError) {
                            const ret = handleError(ex);
console.error("********************", ret)
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

export default useEffectAction;
