import React, {ReactNode, useRef} from "react";
import useViewportWidth, {ViewportDimensions} from "../hooks/useViewportWidth";
import styled, {css} from "styled-components";
import classnames from "classnames";

export type ResponsiveGridProps = {
    children: ReactNode[];
    className?: string;
    minItemWidth?: number;
    totalPaddingWidth?: number;
}

const calculateMaxChildren = (length: number, dimensions?: ViewportDimensions, minItemWidth?: number) => {
    const {width} = dimensions || {};

    if (width && minItemWidth && width / length < minItemWidth) {
        return Math.floor(width / minItemWidth);
    }

    return length;
};

const Container = styled.ol<{length: number; totalPaddingWidth?: number; dimensions?: ViewportDimensions; minItemWidth?: number}>`
    display: flex;
    flex-wrap: wrap;
    
    > * {
      ${({length, totalPaddingWidth, dimensions, minItemWidth}) => {
    const maxLength = calculateMaxChildren(length, dimensions, minItemWidth);
    const width = `${100 / maxLength}%`;
    return css`
          width: ${(totalPaddingWidth && `calc(${width} - ${totalPaddingWidth}px)`) || width};
          &:nth-child(${maxLength}n) {
            border-right: none;
            padding-right: 0;
          }
        `;
}}
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
                className={classnames({"no-js": !(dimensions && dimensions.width > 0)}, className)}
                dimensions={dimensions}
                minItemWidth={minItemWidth}
                totalPaddingWidth={totalPaddingWidth}
            >
                {children}
            </Container>
        )
    };
