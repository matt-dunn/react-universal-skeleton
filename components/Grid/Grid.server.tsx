import React, {ReactNode} from "react";
import styled from "styled-components";

const Container = styled.ol`
    display: flex;
    flex-wrap: wrap;
    
    > * {
      flex-grow: 1;
      min-width: 200px;
    }
`;

export const ResponsiveGrid = (as: keyof JSX.IntrinsicElements | React.ComponentType<any>) => ({children}: {children: ReactNode[]}) => {
    return (
        <Container as={as}>
            {children}
        </Container>
    );
};
