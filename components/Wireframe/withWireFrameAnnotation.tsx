import React, {ComponentType, useCallback, useContext, useEffect, useState} from "react";
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

const IdentifierContainer = styled(IdentifierBase)`
  position: absolute;
  top: -1em;
  left: -1em;
  z-index: 4000;
  cursor: default;
  transition: opacity 250ms, visibility 250ms;
`;

const CreateIdentifier = (Component: ComponentType<any>, options: WireFrameComponentOptions) => function Identifier() {
    const {register, unregister} = useContext(WireFrameAnnotationContext);
    const [annotation, setAnnotation] = useState();

    useEffect(() => {
        setAnnotation(register(Component, options));

        return () => {
            unregister(Component);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        annotation && <IdentifierContainer data-annotation-identifier>{annotation.id}</IdentifierContainer>
    ) || null;
};

export const withWireFrameAnnotation = function<T>(WrappedComponent: ComponentType<T> | string, options: WireFrameComponentOptions) {
    const Component = (props: any) => <WrappedComponent {...props}/>;
    const ComponentIdentifier = CreateIdentifier(Component, options);

    return function WireFrameAnnotation(props: T) {
        const {highlightNote} = useContext(WireFrameAnnotationContext);

        const handleHighlightNote = useCallback(() => {
            highlightNote(Component);
        }, [highlightNote]);

        const handleHighlightNoteReset = useCallback(() => {
            highlightNote(undefined);
        }, [highlightNote]);

        return (
            <Wrapper
                data-annotation
                onMouseOver={handleHighlightNote}
                onMouseLeave={handleHighlightNoteReset}
            >
                <ComponentIdentifier/>
                <Component {...props}/>
            </Wrapper>
        );
    };
};
