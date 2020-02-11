import React, {ComponentType, useCallback, useContext, useEffect, useState} from "react";
import styled from "@emotion/styled";
import css from "@emotion/css";
import {CSSTransition} from "react-transition-group";
import {isString} from "lodash";

import {WireFrameComponent, WireFrameComponentOptions} from "../api";
import {WireFrameAnnotationContext} from "../context";
import {IdentifierBase} from "../styles";

const Wrapper = styled.span<{show: boolean}>`
  position: relative;
  
  [disabled] {
    pointer-events: none;
  }
  
  &:hover {
    ${({show}) => show && css`
      z-index: 5000;
      
      > * {
        box-shadow: 0 0 0 1px #4086f7 !important;
      }
    `}

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
  opacity: 0.75;
  visibility: visible;

  &.fade.enter {
    opacity: 0;
    visibility: hidden;
  }
  &.fade.enter-active {
    opacity: 0.75;
    visibility: visible;
  }
  &.fade.exit {
    opacity: 0.75;
    visibility: visible;
  }
  &.fade.exit-active {
    opacity: 0;
    visibility: hidden;
  }
`;

type IdentifierProps = {
    annotation: WireFrameComponent;
    show: boolean;
}

const Identifier = ({annotation, show}: IdentifierProps) => (
    annotation && <CSSTransition
        timeout={250}
        className="fade"
        in={show}
        mountOnEnter={true}
        unmountOnExit={true}
    >
        <IdentifierContainer data-annotation-identifier>{annotation.id}</IdentifierContainer>
    </CSSTransition>
) || null;

const getDisplayName = (WrappedComponent: ComponentType<any> | string) => {
    return isString(WrappedComponent) ? WrappedComponent : WrappedComponent.displayName || WrappedComponent.name || "Component";
};

export const withWireFrameAnnotation = function<P>(WrappedComponent: ComponentType<P> | string, options: WireFrameComponentOptions) {
    const Component = React.memo((props: any) => <WrappedComponent {...props}/>);
    Component.displayName = `withWireFrameAnnotation(${getDisplayName(WrappedComponent)})`;

    return function WireFrameAnnotation(props: P) {
        const {register, unregister, onOpen, isOpen, highlightNote} = useContext(WireFrameAnnotationContext);
        const [annotation, setAnnotation] = useState();
        const [show, setShow] = useState(isOpen());

        useEffect(() => {
            const cb = onOpen(setShow);
            setAnnotation(register(Component, options));

            return () => {
                cb.unregister();
                unregister(Component);
            };
        }, []); // eslint-disable-line react-hooks/exhaustive-deps

        const handleHighlightNote = useCallback(() => {
            highlightNote(Component);
        }, [highlightNote]);

        const handleHighlightNoteReset = useCallback(() => {
            highlightNote(undefined);
        }, [highlightNote]);

        return (
            <Wrapper
                show={show}
                onMouseOver={handleHighlightNote}
                onMouseLeave={handleHighlightNoteReset}
            >
                <Identifier annotation={annotation} show={show}/>

                <Component {...props}/>
            </Wrapper>
        );
    };
};
