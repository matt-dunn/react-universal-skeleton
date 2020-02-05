import React, {ReactElement, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {useHistory, useLocation} from "react-router";
import {History, Location, UnregisterCallback} from "history";

import {ErrorLike} from "components/error";

import {ErrorHandlerContext, ErrorContext} from "./contexts";

export type CallHandler = {
    (error: ErrorLike, location: string, history: History, props: any): boolean | ReactElement;
}

type ErrorHandlerProps = {
    handler: CallHandler;
    children: ReactNode;
}

const callHandler = (ex: ErrorLike, handler: CallHandler, location: Location, history: History, props: any) => {
    const {pathname, search, hash} = (typeof window !== "undefined" && window.location) || location;

    return handler(
        ex,
        `${pathname}${(search && `?${encodeURIComponent(search.substr(1))}`) || ""}${(hash && `#${encodeURIComponent(hash.substr(1))}`) || ""}`,
        history,
        props
    );
};

const getInitialComponent = (ex: ErrorLike, handler: CallHandler, location: Location, history: History, props: any) => {
    const ret = callHandler(ex, handler, location, history, props);

    return (ret !== false && ret !== true && ret && ret);
};

const ErrorHandler = ({handler, children, ...props}: ErrorHandlerProps) => {
    const history = useHistory();
    const location = useLocation();
    const unlisten = useRef<UnregisterCallback>();
    const errorContext = useContext(ErrorContext);
    const [component, setComponent] = useState(errorContext && errorContext.error && getInitialComponent(errorContext.error, handler, location, history, props));

    useEffect(() => {
        unlisten.current = history.listen(() => {
            setComponent(undefined);
            errorContext && (errorContext.error = undefined);
        });

        return () => {
            unlisten.current && unlisten.current();
        };
    }, [errorContext, history]);

    const handleError = useRef<ErrorHandlerContext>({
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
    );
};

export default React.memo(ErrorHandler);
