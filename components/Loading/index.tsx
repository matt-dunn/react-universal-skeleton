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
    inline?: boolean;
};

const Container = styled.div<{height: number}>`
  position: relative;
  min-height: ${({height}) => `${height}px`};
`;

const LoaderContainer = styled.div<{height: number}>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  height: ${({height}) => `${height}px`};
  width: ${({height}) => `${height}px`};
`;

const ContainerInline = styled.span`
  display: flex;
  align-items: center;
`;

const LoaderContainerInline = styled.span`
  display: inline-block;
  width: 1em;
  height: 1em;
  margin: 0 4px;
  position: relative;
  line-height: 1;
`;

const Loading = ({children, loading = true, loader, timeout = 500, height = 50, inline = false}: LoadingProps) => {
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

    const LoadingLoader = loader ? loader({height}) : <Spinner/>;

    if (inline) {
        return (
            <ContainerInline>
                {children}
                {show && loading && <LoaderContainerInline>{LoadingLoader}</LoaderContainerInline>}
            </ContainerInline>
        );
    } else {
        return (
            <Container height={height}>
                {children}
                {show && loading && <LoaderContainer height={height}>{LoadingLoader}</LoaderContainer>}
            </Container>
        );
    }
};

export default Loading;
