import React, {ReactNode, useEffect, useRef, useState} from 'react'

import myStyled from "components/myStyled";
// import myStyled from "styled-components";

const Fancy = ({children, className}: {children?: ReactNode; className?: string; fancy?: boolean}) => {
    return (
        <div className={className}>
            Fancy:
            {children}
        </div>
    );
}

const Styled = myStyled<{color: string; index: number; xxz?: string}>(Fancy)`
    :global(body) {background:${({color}) => (color === "green" && "red") || "#ececec"}}
    padding: ${({index}) => `${20 + ((index || 0) * 50)}px`};
    color: ${({color}) => color};
    ${props => props.index}
    border: 3px solid orange;
    ${({color, index}) => color === "blue" && index === 0 && `
        background-color: orange;
        font-weight: bold;
    `}
    
    ${3}
    ${props => props.xxz}

    &:hover {
        background-color: ${({color}) => (color === "blue" && "green") || "yellow"}
    }
    
    address {
        padding: ${({index}) => `${20 + ((index || 0) * 50)}px`};
    }

    @media only screen and (max-width: 1000px) {
        && {
            border: 10px solid ${({color}) => color};
        }
    }
    
    margin-top: 100px;
`;

const Styled2 = myStyled("address")`
    border: 1px solid red;
    padding: 10px;

    &:hover {
        background-color: red;
    }
`;

const Styled3 = myStyled(Styled2)`
    font-size: 20px;
`;

const Styled4 = myStyled("address")`
    @font-face {
      font-family: 'Modak';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Modak'), url(https://fonts.gstatic.com/s/modak/v5/EJRYQgs1XtIEskMA-hR77LKV.woff2) format('woff2');
    }

    font-weight: bold;
    animation-duration: 3s;
    animation-name: slidein;
    
    &:hover {
        background-color: blue;
    }
    
    p {
        background-color: #eee;
    }

    @keyframes slidein {
      from {
        margin-left: 100%;
        width: 300%; 
      }
    
      to {
        margin-left: 0%;
        width: 100%;
      }
    }

    @media only screen and (max-width: 1000px) {
        && {
            border: 10px solid purple;
        }
    }
    
    background-color: #fff;

    font-family: 'Modak';
`;

const TestMyStyled = () => {
    const [color, setColor] = useState("green");
    const [index, setIndex] = useState(0);
    const t1 = useRef<number>()
    const t2 = useRef<number>()

    useEffect(() => {
        console.log("READY");

        t1.current = setTimeout(() => {
            setColor("blue")
        }, 2000);

        t2.current = setTimeout(() => {
            setColor("violet")
            setIndex(index => index + 1)
        }, 4000)

        return () => {
            clearTimeout(t1.current)
            clearTimeout(t2.current)
        }
    }, []);

    return (
        <>
            <Styled className="bob" color={color} index={index}>
                {color}
                <Styled4 className="my-lovely-horse">
                    INNER: {color}
                    <p>
                        Para
                    </p>
                </Styled4>
                <Styled4 className="my-lovely-horse">
                    INNER: {color}
                    <p>
                        Para
                    </p>
                </Styled4>
            </Styled>
            <Styled color="indigo" index={index}>
                {color}
                <Styled4 className="my-lovely-horse">
                    INNER: {color}
                    <p>
                        Para
                    </p>
                </Styled4>
                <Styled4 className="my-lovely-horse">
                    INNER: {color}
                    <p>
                        Para
                    </p>
                </Styled4>
            </Styled>
        </>
    );
};

export default TestMyStyled;
