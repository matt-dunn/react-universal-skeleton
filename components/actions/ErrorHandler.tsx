import React, {ReactNode, useContext, useEffect, useRef, useState} from "react";
import {useHistory, useLocation} from "react-router";
import {History, Location, UnregisterCallback} from "history";

import {ErrorLike} from "components/error";

import {ErrorHandlerContext, ErrorContext} from "./contexts";

type Update = {
    (): void;
}

type  HandleErrorMeta = {
    component: ReactNode;
    includeChildren?: boolean;
};

export type HandleError = {
    (error: ErrorLike, location: string, history: History, props: any, update?: Update): HandleErrorMeta | undefined;
}

type ErrorHandlerProps = {
    handler: HandleError;
    children: ReactNode | ReactNode[];
}

const callHandler = (ex: ErrorLike, handler: HandleError, location: Location, history: History, props: any, update?: Update) => {
    const {pathname, search, hash} = (typeof window !== "undefined" && window.location) || location;

    return handler(
        ex,
        `${pathname}${(search && `?${encodeURIComponent(search.substr(1))}`) || ""}${(hash && `#${encodeURIComponent(hash.substr(1))}`) || ""}`,
        history,
        props,
        update
    );
};

const ErrorHandler = ({handler, ...props}: ErrorHandlerProps) => {
    const history = useHistory();
    const location = useLocation();
    const unlisten = useRef<UnregisterCallback>();
    const errorContext = useContext(ErrorContext);
    const [componentMeta, setComponentMeta] = useState(errorContext && errorContext.error && callHandler(errorContext.error, handler, location, history, props));
    const [key, setKey] = useState(0);

    useEffect(() => {
        unlisten.current = history.listen(() => {
            setComponentMeta(undefined);
            errorContext && (errorContext.error = undefined);
        });

        return () => {
            unlisten.current && unlisten.current();
        };
    }, [errorContext, history]);

    const handleError = useRef<ErrorHandlerContext>({
        handleError: ex => {
            const ret = callHandler(ex, handler, location, history, props, () => {
                setKey(value => ++value);
            });
            setComponentMeta(ret);
            return ret !== undefined;
        }
    });

    const {children} = props;

    return (
        <ErrorHandlerContext.Provider value={handleError.current} key={key}>
            {componentMeta?.component}
            {(!componentMeta?.component || componentMeta.includeChildren) && children}
        </ErrorHandlerContext.Provider>
    );
};

export default React.memo(ErrorHandler);
