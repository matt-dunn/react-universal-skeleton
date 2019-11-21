import {useEffect, useContext} from "react";
import isPromise from "is-promise";

import {ErrorHandlerContext} from "../contexts";

const useEffectAction = (action, test) => {
    const {handleError} = useContext(ErrorHandlerContext) || {};

    useEffect(() => {
        if ((!test || test())) {
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
    }, [action, test, handleError]);
};

export default useEffectAction;
