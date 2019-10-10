import React, {useContext, useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {useHistory, useLocation} from "react-router";

import {ErrorHandlerContext, ErrorContext} from "./contexts";

const callHandler = (ex, handler, location, history, props) => {
    const {pathname, search, hash} = location;

    return handler(
        ex,
        `${pathname}${(search && `?${encodeURIComponent(search.substr(1))}`) || ""}${(hash && `#${encodeURIComponent(hash.substr(1))}`) || ""}`,
        history,
        props
    );
};

const getInitialComponent = (ex, handler, location, history, props) => {
    const ret = callHandler(ex, handler, location, history, props);

    return (ret !== false && ret !== true && ret && ret)
};

const ErrorHandler = ({handler, children, ...props}) => {
    const history = useHistory();
    const location = useLocation();
    const unlisten = useRef(null);
    const errorContext = useContext(ErrorContext)
    const [component, setComponent] = useState(errorContext && errorContext.error && getInitialComponent(errorContext.error, handler, location, history, props));

    useEffect(() => {
        unlisten.current = history.listen(() => {
            window.__PRERENDERED_SSR__ = false;
            setComponent(undefined);
            errorContext.error = undefined;
        });

        return () => {
            unlisten.current();
        }
    }, [errorContext.error, history]);

    const handleError = useRef({
        handleError: ex => {
            const ret = callHandler(ex, handler, location, history, props);

            if (ret !== false && ret !== true && ret) {
                setComponent(ret);
            }

            return ret;
        }
    });

    return (
        <ErrorHandlerContext.Provider value={handleError.current}>
            {component || children}
        </ErrorHandlerContext.Provider>
    )
};

ErrorHandler.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),

    handler: PropTypes.func.isRequired
};

export default React.memo(ErrorHandler);
