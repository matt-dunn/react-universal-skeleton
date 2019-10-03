import {FunctionComponent} from "react";

declare function handleViewport<T>(host: FunctionComponent<T>, options?: any, config?: any): any;

declare namespace handleViewport {
    type ReactInViewportProps = {
        forwardedRef: () => {};
        inViewport: boolean;
    };
}

export = handleViewport;
