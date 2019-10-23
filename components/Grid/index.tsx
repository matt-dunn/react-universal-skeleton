import React, {ReactNode, useRef} from "react";
import useViewportWidth, {ViewportDimensions} from "../hooks/useViewportWidth";
import styled, {css} from "styled-components";
import {Container} from "postcss";

const calculateMaxChildren = (children: ReactNode[], dimensions?: ViewportDimensions, minItemWidth?: number) => {
    const {width} = dimensions || {};

    if (width && minItemWidth && width / children.length < minItemWidth) {
        return Math.floor(width / minItemWidth);
    }

    return children.length;
};

const Container = styled.ol<{children: ReactNode[]; totalPaddingWidth?: number; dimensions?: ViewportDimensions; minItemWidth?: number}>`
    display: flex;
    flex-wrap: wrap;
    
    > * {
      ${({children, totalPaddingWidth, dimensions, minItemWidth}) => {
        const length = calculateMaxChildren(children, dimensions, minItemWidth);
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

export type ResponsiveGrid = {
    children: ReactNode[];
    className?: string;
    minItemWidth?: number;
    totalPaddingWidth?: number;
}

export const ResponsiveGrid = (as: keyof JSX.IntrinsicElements | React.ComponentType<any>) => ({children, className, minItemWidth, totalPaddingWidth}: ResponsiveGrid) => {
    const container = useRef();
    const dimensions = useViewportWidth(container);

    return (
        <Container as={as} ref={container as any} className={className} dimensions={dimensions} minItemWidth={minItemWidth} totalPaddingWidth={totalPaddingWidth}>
            {children}
        </Container>
    )
};
