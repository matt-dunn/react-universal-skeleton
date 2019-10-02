import styled from "styled-components";
import React, {useEffect, useRef, useState} from "react";

export type LoadingProps = { children: any; Loader?: any; loading: boolean };

const Container = styled.div`
    position: relative;
`

const Message = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 3px 10px;
    border-radius: 50px;
    background-color: #999;
    color: #fff;
    transform: translate(-50%, -50%);
`

const Loading = ({children, loading, Loader = <Message>Loading...</Message>}: LoadingProps) => {
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
