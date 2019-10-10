import styled from "styled-components";
import React, {ReactNode, useEffect, useRef, useState} from "react";

import Spinner from "./Spinner";

export type LoadingProps = {
    children: ReactNode | ReactNode[];
    Loader?: ReactNode;
    loading: boolean;
};

const Container = styled.div`
    position: relative;
`

const Loading = ({children, loading, Loader = <Spinner/>}: LoadingProps) => {
    const [show, setShow] = useState(false);
    const t = useRef<number>();

    useEffect(() => {
        if (loading) {
            t.current = setTimeout(() => {
                setShow(true)
            }, 500)
        } else {
            setShow(false)
            clearTimeout(t.current)
        }

        return () => clearTimeout(t.current)
    }, [loading])

    return (
        <Container>
            {show && loading && Loader}
            {children}
        </Container>
    );
}

export default Loading;
