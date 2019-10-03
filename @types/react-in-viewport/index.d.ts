import {FunctionComponent} from "react";

declare namespace handleViewport {
    type ReactInViewportProps = {
        forwardedRef: () => {};
        inViewport: boolean;
    };
}

declare function handleViewport<T>(Component: FunctionComponent<T>, options?: object, config?: object): FunctionComponent<any>;

export = handleViewport;
