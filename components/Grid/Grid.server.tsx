import React from "react";
import styled, {css} from "styled-components";

import {ResponsiveGridProps} from "./Grid.client";

const Container = styled.ol<{minItemWidth?: number}>`
    display: flex;
    flex-wrap: wrap;
    
    > * {
      flex-grow: 1;
      ${({minItemWidth}) => (minItemWidth && css`min-width: ${minItemWidth}px`) || ""};
    }
`;

export const ResponsiveGrid = (as: keyof JSX.IntrinsicElements | React.ComponentType<any>) => ({children, className, minItemWidth}: ResponsiveGridProps) => {
    return (
        <div className="no-js">
            <Container as={as} className={className} minItemWidth={minItemWidth}>
                {children}
            </Container>
        </div>
    );
};
