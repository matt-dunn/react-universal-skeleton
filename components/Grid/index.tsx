import React, {ReactNode, useRef} from "react";
import useViewportWidth, {ViewportDimensions} from "../hooks/useViewportWidth";
import styled, {css} from "styled-components";
import {Container} from "postcss";

const calculateMaxChildren = (children: ReactNode[], dimensions?: ViewportDimensions, minWidth?: number) => {
    const {width} = dimensions || {};

    if (width && minWidth && width / children.length < minWidth) {
        return Math.floor(width / minWidth);
    }

    return children.length;
};

const Container = styled.ol<{children: ReactNode[]; totalPaddingWidth?: number, dimensions?: ViewportDimensions; minWidth?: number}>`
    display: flex;
    flex-wrap: wrap;
    
    > * {
      ${({children, totalPaddingWidth, dimensions, minWidth}) => {
        const length = calculateMaxChildren(children, dimensions, minWidth);
        const width = `${100 / length}%`;
        return css`
          width: ${(totalPaddingWidth && `calc(${width} - ${totalPaddingWidth}px)`) || width};
          &:nth-child(${length}n) {
            border-right: none;
          }
        `;
      }}
    }
`;

type ResponsiveGrid = {
    type?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
    children: ReactNode[],
    className?: string;
    minWidth?: number,
    totalPaddingWidth?: number;
}

export const ResponsiveGrid = ({type, children, className, minWidth, totalPaddingWidth}: ResponsiveGrid) => {
    const container = useRef();
    const dimensions = useViewportWidth(container);

    return (
        <Container as={type} ref={container as any} className={className} dimensions={dimensions} minWidth={minWidth} totalPaddingWidth={totalPaddingWidth}>
            {children}
        </Container>
    )
};
