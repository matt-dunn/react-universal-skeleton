import {ComponentType} from "react";

export const withWireFrameAnnotation = function<P>(WrappedComponent: ComponentType<P> | string) {
    return WrappedComponent;
};
