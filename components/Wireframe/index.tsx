import styled from "@emotion/styled";
import React, {ComponentType, createContext, ReactNode, ReactText, useContext, useEffect, useState} from "react";
import {remove} from "lodash";
import css from "@emotion/css";

const Wrapper = styled.span`
  position: relative;
  
  //&:hover {
  //    > * {
  //      box-shadow: 0 0 0 1px #4086f7 !important;
  //    }
  //    
  //    > cite {
  //      opacity: 1;
  //    }
  //}
`;

const IdentifierBase = styled.cite`
  border-radius: 50px;
  background-color: yellow;
  border-color: #FFD600;
  font-size: 1em;
  white-space: nowrap;
  width: 2em;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-weight: normal;
`;

const Identifier = styled(IdentifierBase)`
  position: absolute;
  top: -1em;
  left: -1em;
  opacity: 0.5;
  z-index: 4000;
  cursor: default;
  transition: opacity 250ms;
  
  &:hover {
    opacity: 1;
  }
`;

const IdentifierNote = styled(IdentifierBase)`
  margin-right: 0.5em;
`;

type WireFrameComponentOptions = {
    title: ReactNode | ReactText;
    description: ReactNode | ReactText;
}

type WireFrameComponent = {
    id: number;
    Component: ComponentType<any>;
    count: number;
    options: WireFrameComponentOptions;
}

type WireFrameComponents = WireFrameComponent[];

type WireFrameAnnotationAPI = {
    setOptions: (options: Options) => void;
    register: (Component: ComponentType<any>, options: WireFrameComponentOptions) => WireFrameComponent;
    unregister: (Component: ComponentType<any>) => void;
}

type Options = {
    updater?: (components: WireFrameComponents) => any;
}

const API = function(): WireFrameAnnotationAPI {
    let components: WireFrameComponents = [];
    let apiOptions: Options;

    return {
        setOptions: (options: Options) => {
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

const api = API();

const WireFrameAnnotationContext = createContext<WireFrameAnnotationAPI>(api);

type WireFrameProviderProps = {
    children: ReactNode;
}

const WireFrameContainer = styled.div<{show: boolean}>`
  display: flex;

  ${({show = true}) => {
    if (show) {
        return css`
              [data-annotations-container] {
                  width: 25%;
                  min-width: 250px;
              }
          `
    } else {
        return css`
              [data-annotation-identifier] {
                opacity: 0 !important;
              }
              [data-annotations-container] {
                  width: 0;
                  min-width: 0;
                  
                  [data-annotations] {
                    transform: translateX(100%);
                  }
              }
          `
    }
}};
`;

const WireFrameBody = styled.div`
  flex-grow: 1;
`;

const WireFrameAnnotationsContainer = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  max-width: 400px;
  padding: 0;
  transition: width 250ms, min-width 250ms;

`;

const WireFrameAnnotations = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  border-left: 2px solid #555;
  padding: 0;
  width: 25%;
  max-width: 400px;
  min-width: 250px;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  font-size: 1.2rem;
  transition: transform 250ms;
  
  > header {
    margin-bottom: 1em;
    padding: 3px 10px;
    background-color: #555;
    color: #fff
  }
`;

const WireFrameAnnotationsOpen = styled.div`
  position: absolute;
  left: -1px;
  top: 10px;
  background-color: #555;
  color: #fff;
  padding: 5px;
  border-radius: 5px 0 0 5px;
  transform: translateX(-100%);
`

const WireFrameAnnotationsNotes = styled.ul`
  overflow: auto;
  padding-bottom: 10px;
  
  li {
    margin: 0 0 10px 0;
    padding: 0 0 10px 0;
    border-bottom: 1px solid #ccc;
    
    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    
    header {
      display: flex;
      padding: 0 10px;
    }
    
    article {
      padding: 0 10px;
    }
  }
`;

export const WireFrameProvider = ({children}: WireFrameProviderProps) => {
    // return children;

    const [components, setComponents] = useState<WireFrameComponents>();
    const [show, setShow] = useState(true);

    useEffect(() => {
        api.setOptions({
            updater: setComponents
        });
    }, []);

    return (
        <WireFrameAnnotationContext.Provider value={api}>
            <WireFrameContainer show={show}>
                <WireFrameBody>
                    {children}
                </WireFrameBody>
                <WireFrameAnnotationsContainer data-annotations-container>
                    <WireFrameAnnotations data-annotations>
                        <WireFrameAnnotationsOpen onClick={() => setShow(true)}>
                            O
                        </WireFrameAnnotationsOpen>
                        <header>
                            <h1>Annotations</h1>
                            <div onClick={() => setShow(false)}>X</div>
                        </header>
                        <WireFrameAnnotationsNotes>
                            {components && components.map(component => {
                                return (
                                    <li key={component.id}>
                                        <header>
                                            <IdentifierNote>{component.id}</IdentifierNote>
                                            <h2>
                                                {component.options.title}
                                            </h2>
                                        </header>
                                        <article>
                                            {component.options.description}
                                        </article>
                                    </li>
                                );
                            })}
                        </WireFrameAnnotationsNotes>
                    </WireFrameAnnotations>
                </WireFrameAnnotationsContainer>
            </WireFrameContainer>
        </WireFrameAnnotationContext.Provider>
    );
};

export const withWireFrameAnnotation = function<T>(WrappedComponent: ComponentType<T>, options: WireFrameComponentOptions) {
    const Component = (props: any) => <WrappedComponent {...props}/>

    return (props: T) => {
        // return <WrappedComponent {...props}/>;

        const {register, unregister} = useContext<WireFrameAnnotationAPI>(WireFrameAnnotationContext);
        const [annotation, setAnnotation] = useState();

        useEffect(() => {
            setAnnotation(register(Component, options));

            return () => {
                unregister(Component);
            };
        }, [register, unregister]);

        return (
            <Wrapper data-annotation>
                {annotation && <Identifier data-annotation-identifier>{annotation.id}</Identifier>}
                {/*ANNOTATION... {description}*/}
                <Component {...props}/>
            </Wrapper>
        );
    };
};

