import React, {ReactNode, useEffect, useRef, useState} from "react";
import styled from "styled-components";

import Spinner from "./Spinner";

export type LoadingProps = {
    children: ReactNode | ReactNode[];
    Loader?: ReactNode;
    loading: boolean;
    timeout?: number;
};

const Container = styled.div`
    position: relative;
`;

const Loading = ({children, loading, Loader = <Spinner/>, timeout = 500}: LoadingProps) => {
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

    return (
        <Container>
            {show && loading && Loader}
            {children}
        </Container>
    );
};

export default Loading;
