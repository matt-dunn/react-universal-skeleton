import {FunctionComponent} from "react";

declare namespace handleViewport {
    type ReactInViewportProps = {
        forwardedRef: () => {};
        inViewport: boolean;
    };
}

type Config = {
    disconnectOnLeave?: boolean;
}

declare function handleViewport<T>(Component: FunctionComponent<T>, options?: IntersectionObserverInit, config?: Config): FunctionComponent<any>;

export = handleViewport;
