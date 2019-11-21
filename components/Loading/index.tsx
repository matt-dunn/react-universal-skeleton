import React, {ReactElement, ReactNode, useEffect, useRef, useState} from "react";
import styled from "@emotion/styled";

import Spinner from "./Spinner";

type Loader = {
    ({height}: {height: number}): ReactElement<any>;
};

type LoadingProps = {
    children?: ReactNode | ReactNode[];
    loader?: Loader;
    loading?: boolean;
    timeout?: number;
    height?: number;
};

const Container = styled.div<{height: number}>`
  position: relative;
  min-height: ${({height}) => `${height}px`};
`;

const Loading = ({children, loading = true, loader, timeout = 500, height = 50}: LoadingProps) => {
    const [show, setShow] = useState(false);
    const t = useRef<number>();

    useEffect(() => {
        if (loading) {
            t.current = setTimeout(() => {
                setShow(true);
            }, timeout);
        } else {
            setShow(false);
            clearTimeout(t.current);
        }

        return () => clearTimeout(t.current);
    }, [loading, timeout]);

    const LoadingLoader = loader ? loader({height}) : <Spinner height={height}/>;

    return (
        <Container height={height}>
            {show && loading && LoadingLoader}
            {children}
        </Container>
    );
};

export default Loading;
