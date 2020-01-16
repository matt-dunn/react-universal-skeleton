import styled from "@emotion/styled";
import React, {ComponentType} from "react";

type WireFrameAnnotationProps = {
    description: string;
}

const Wrapper = styled.div`
  position: relative;
`;

const Identifier = styled.div`
  position: absolute;
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
  top: -1em;
  left: -1em;
  opacity: 0.75;
  cursor: pointer;
  
  &:hover {
    opacity: 1;
  }
`;

export const withWireFrameAnnotation = function<T>(WrappedComponent: ComponentType<T>, {description}: WireFrameAnnotationProps) {
    return (props: T) => (
        <Wrapper>
            <Identifier>1</Identifier>
            ANNOTATION... {description}
            <WrappedComponent {...props}/>
        </Wrapper>
    );
};

