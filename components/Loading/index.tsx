import React, {ComponentType, ReactElement, ReactNode, useEffect, useRef, useState} from "react";
import styled from "styled-components";

import Spinner from "./Spinner";

type Loader = {
    ({height}: {height: number}): ReactElement<any>;
};

type LoadingProps = {
    children?: ReactNode | ReactNode[];
    Loader?: ComponentType<any>;
    loaderRender?: Loader;
    loading?: boolean;
    timeout?: number;
    height?: number;
};

const Container = styled.div<{height: number}>`
  position: relative;
  min-height: ${({height}) => `${height}px`};
`;

const Loading = ({children, loading = true, Loader = Spinner, loaderRender, timeout = 500, height = 50}: LoadingProps) => {
    const [show, setShow] = useState(false);
    const t = useRef<number>();

    useEffect(() => {
        if (loading) {
            t.current = setTimeout(() => {
                setShow(true)
            }, timeout)
        } else {
            setShow(false)
            clearTimeout(t.current)
        }

        return () => clearTimeout(t.current)
    }, [loading, timeout]);

    const LoadingLoader = loaderRender ? loaderRender({height}) : <Loader height={height}/>;

    return (
        <Container height={height}>
            {show && loading && LoadingLoader}
            {children}
        </Container>
    );
};

export default Loading;
