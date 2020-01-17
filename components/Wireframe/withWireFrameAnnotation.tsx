import React, {ComponentType, useContext, useEffect, useState} from "react";
import styled from "@emotion/styled";

import {WireFrameComponentOptions} from "./api";
import {WireFrameAnnotationContext} from "./context";
import {IdentifierBase} from "./styles";

const Wrapper = styled.span`
  position: relative;
  
  &:hover {
      > * {
        box-shadow: 0 0 0 2px #4086f7 !important;
      }
      
      > [data-annotation-identifier] {
        transition: opacity 0ms, visibility 0ms;
        opacity: 1;
      }
  }
`;

const Identifier = styled(IdentifierBase)`
  position: absolute;
  top: -1em;
  left: -1em;
  opacity: 0.5;
  z-index: 4000;
  cursor: default;
  transition: opacity 250ms, visibility 250ms;
`;

export const withWireFrameAnnotation = function<T>(WrappedComponent: ComponentType<T>, options: WireFrameComponentOptions) {
    const Component = (props: any) => <WrappedComponent {...props}/>;

    return function WireFrameAnnotation(props: T) {
        const {register, unregister} = useContext(WireFrameAnnotationContext);
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
                <Component {...props}/>
            </Wrapper>
        );
    };
};
