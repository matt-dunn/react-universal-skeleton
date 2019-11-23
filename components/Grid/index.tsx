import React, {ReactNode, useRef} from "react";
import useViewportWidth, {ViewportDimensions} from "../hooks/useViewportWidth";
import styled from "@emotion/styled";
import {css} from "@emotion/core";

export type ResponsiveGridProps = {
    children: ReactNode[];
    className?: string;
    minItemWidth?: number;
    totalPaddingWidth?: number;
}

const calculateMaxChildren = (length: number, dimensions?: ViewportDimensions, minItemWidth?: number) => {
    const {width} = dimensions || {};

    if (width && minItemWidth && (width / length) < minItemWidth) {
        return Math.floor(width / minItemWidth);
    }

    return length;
};

const calculateChildStyle = (length: number, dimensions?: ViewportDimensions, minItemWidth?: number, totalPaddingWidth?: number) => {
    const maxLength = calculateMaxChildren(length, dimensions, minItemWidth);
    const width = `${100 / maxLength}%`;
    return css`
          ${(minItemWidth && `min-width: ${minItemWidth - (totalPaddingWidth || 0)}px`) || ""};
          ${!dimensions && "flex-grow: 1"};
          width: ${(totalPaddingWidth && `calc(${width} - ${totalPaddingWidth}px)`) || width};
      `;
};

const Container = styled.ol<{as: keyof JSX.IntrinsicElements | React.ComponentType<any>; length: number; totalPaddingWidth?: number; dimensions?: ViewportDimensions; minItemWidth?: number}>`
    display: flex;
    flex-wrap: wrap;
    
    > * {
      ${({length, totalPaddingWidth, dimensions, minItemWidth}) => calculateChildStyle(length, dimensions, minItemWidth, totalPaddingWidth)};
    }
`;

export const ResponsiveGrid = (as: keyof JSX.IntrinsicElements | React.ComponentType<any>) =>
    ({children, className, minItemWidth, totalPaddingWidth}: ResponsiveGridProps) => {
        const container = useRef(); // eslint-disable-line react-hooks/rules-of-hooks
        const dimensions = useViewportWidth(container); // eslint-disable-line react-hooks/rules-of-hooks

        return (
            <Container
                as={as}
                ref={container as any}
                length={children.length}
                className={className}
                dimensions={dimensions}
                minItemWidth={minItemWidth}
                totalPaddingWidth={totalPaddingWidth}
            >
                {children}
            </Container>
        );
    };
