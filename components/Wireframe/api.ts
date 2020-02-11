import {ComponentType, ReactNode} from "react";
import {remove} from "lodash";

export type APIOptions = {
    updater: (components: WireFrameComponents) => void;
    highlightNote?: (component?: WireFrameComponent) => void;
}

export type WireFrameComponentOptions = {
    title: ReactNode;
    description: ReactNode;
}

export type WireFrameComponent = {
    id: number;
    Component: ComponentType<any>;
    count: number;
    options: WireFrameComponentOptions;
}

export type WireFrameComponents = WireFrameComponent[];

type OpenCallback = (isOpen: boolean) => void;

export type WireFrameAnnotationAPI = {
    setOptions: (options: APIOptions) => APIOptions;
    register: (Component: ComponentType<any>, options: WireFrameComponentOptions) => WireFrameComponent;
    unregister: (Component: ComponentType<any>) => void;
    highlightNote: (Component: ComponentType<any> | undefined) => void;
    setOpen: (isOpen: boolean) => boolean;
    onOpen: (cb: OpenCallback) => {unregister: () => void};
    isOpen: () => boolean;
}

export const API = function(): WireFrameAnnotationAPI {
    let components: WireFrameComponents = [];
    let apiOptions: APIOptions;

    let openCallbacks: OpenCallback[] = [];
    let isOpen = false;

    const getComponent = (Component: ComponentType<any> | undefined): WireFrameComponent | undefined => Component && components.find(c => c.Component === Component);

    return {
        setOptions: options => apiOptions = options,
        register: (Component, options) => {
            const component = getComponent(Component);

            if (component) {
                component.count++;

                apiOptions && apiOptions.updater && apiOptions.updater(components);

                return component;
            } else {
                const newComponent = {
                    id: components.length + 1,
                    Component,
                    count: 1,
                    options
                };

                components = [...components, newComponent];

                apiOptions && apiOptions.updater && apiOptions.updater(components);

                return newComponent;
            }
        },
        unregister: Component => {
            const component = getComponent(Component);

            if (component) {
                component.count--;

                if (component.count === 0) {
                    components = remove(components, c => c.Component !== Component);
                }
            }

            apiOptions.updater && apiOptions.updater(components);
        },
        highlightNote: Component => apiOptions && apiOptions.highlightNote && apiOptions.highlightNote(getComponent(Component)),
        setOpen: open => {
            isOpen = open;
            openCallbacks.forEach(cb => cb(isOpen));
            return isOpen;
        },
        onOpen: cb => {
            openCallbacks = [...openCallbacks, cb];
            return {
                unregister: () => {
                    openCallbacks = remove(openCallbacks, c => c !== cb);
                }
            };
        },
        isOpen: () => isOpen
    };
};

