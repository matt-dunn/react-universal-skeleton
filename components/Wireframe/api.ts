import {ComponentType, ReactNode, ReactText} from "react";
import {remove} from "lodash";

export type APIOptions = {
    updater?: (components: WireFrameComponents) => any;
}

export type WireFrameComponentOptions = {
    title: ReactNode | ReactText;
    description: ReactNode | ReactText;
}

export type WireFrameComponent = {
    id: number;
    Component: ComponentType<any>;
    count: number;
    options: WireFrameComponentOptions;
}

export type WireFrameComponents = WireFrameComponent[];

export type WireFrameAnnotationAPI = {
    setOptions: (options: APIOptions) => void;
    register: (Component: ComponentType<any>, options: WireFrameComponentOptions) => WireFrameComponent;
    unregister: (Component: ComponentType<any>) => void;
}

export const API = function(): WireFrameAnnotationAPI {
    let components: WireFrameComponents = [];
    let apiOptions: APIOptions;

    return {
        setOptions: (options: APIOptions) => {
            apiOptions = options;
            apiOptions && apiOptions.updater && apiOptions.updater(components);
        },
        register: (Component, options) => {
            const index = components.findIndex(c => c.Component === Component);

            if (index === -1) {
                const component = {
                    id: components.length + 1,
                    Component,
                    count: 1,
                    options
                };
                components = [...components, component];

                apiOptions && apiOptions.updater && apiOptions.updater(components);

                return component;
            } else {
                components[index].count++;

                apiOptions && apiOptions.updater && apiOptions.updater(components);

                return components[index];
            }
        },
        unregister: (Component) => {
            const index = components.findIndex(c => c.Component === Component);

            if (index >= 0) {
                const component = components[index];

                component.count--;

                if (component.count === 0) {
                    components = remove(components, c => c.Component !== Component);
                }
            }

            apiOptions.updater && apiOptions.updater(components);
        },
    };
};

