import React, {ComponentType, useContext, useEffect, useState} from "react";
import styled from "@emotion/styled";

import {WireFrameComponentOptions} from "./api";
import {WireFrameAnnotationContext} from "./context";
import {IdentifierBase} from "./styles";

const Wrapper = styled.span`
  position: relative;
  
  &:hover {
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
  z-index: 4000;
  cursor: default;
  transition: opacity 250ms, visibility 250ms;
`;

export const withWireFrameAnnotation = function<T>(WrappedComponent: ComponentType<T> | string, options: WireFrameComponentOptions) {
    const Component = (props: any) => <WrappedComponent {...props}/>;

    return function WireFrameAnnotation(props: T) {
        const {register, unregister, highlightNote} = useContext(WireFrameAnnotationContext);
        const [annotation, setAnnotation] = useState();

        useEffect(() => {
            setAnnotation(register(Component, options));

            return () => {
                unregister(Component);
            };
        }, [register, unregister]);

        const handleHighlightNote = () => {
            highlightNote(Component);
        };

        const handleHighlightNoteReset = () => {
            highlightNote(undefined);
        };

        return (
            <Wrapper
                data-annotation
                onMouseOver={handleHighlightNote}
                onMouseLeave={handleHighlightNoteReset}
            >
                {annotation && <Identifier data-annotation-identifier>{annotation.id}</Identifier>}
                <Component {...props}/>
            </Wrapper>
        );
    };
};
