import React, {ReactNode, useEffect, useRef, useState} from 'react'

import myStyled from "components/myStyled";
// import myStyled from "styled-components";

const Fancy = ({children, className}: {children?: ReactNode; className?: string; fancy?: boolean}) => {
    return (
        <div className={className}>
            Fancy:
            {children}
            <p className="yes">Hello!!!</p>
        </div>
    );
}

const Styled = myStyled<{color: string; index: number; xxz?: string}>(Fancy)`
    :global(body) {background:${({color}) => (color === "green" && "red") || "#ececec"}}
    padding: ${({index}) => `${20 + ((index || 0) * 50)}px`};
    color: ${({color}) => color};
    border: 3px solid orange;
    ${({color, index}) => color === "blue" && index === 0 && `
        background-color: orange;
        font-weight: bold;
    `}
    
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

    ${props => props.color} {a:3}
    
    .yes {
        background-color: red;
    }
`;

const Styled2 = myStyled("address")`
    border: 1px solid violet;
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
    border: 1px solid #ddd;
    font-family: 'Modak';
    
    & + & {
        color: orange;
    }
`;

const Button = myStyled("button")`
    border: 2px solid red;
    border-radius: 4px;
    color: #333;
    padding: 3px 6px;
`

const PrimaryButton = myStyled(Button)`
    color: white;
    background-color: red;
`

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
                        <Button value={"d"} onClick={() => console.log("Click Hello!")}>Hello</Button>
                    </p>
                </Styled4>
                <Styled4 className="my-lovely-horse">
                    INNER: {color}
                    <p>
                        Para
                        <PrimaryButton onClick={() => console.log("Click There!")}>There</PrimaryButton>
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

            {/*{Array.from(Array(1000).keys()).map(index => {*/}
            {/*    return <Styled2 key={index}>{index}</Styled2>*/}
            {/*})}*/}

            {/*<Styled4>END!</Styled4>*/}
        </>
    );
};

export default TestMyStyled;


type Fancy2Props = {
    moose: string;
    hole: boolean;
    bum: boolean;
}
const Fancy2 = ({}: Fancy2Props) => {
    return null;
}


const Styled5 = myStyled<Fancy2Props>("div")`
    border: 1px solid red;
    padding: 10px;
    ${props => props.moose && "2"}

    &:hover {
        background-color: red;
    }
`;

const Styled6 = myStyled

// const x = myStyled().
const X = () => {
    return (
        <Styled5 value={3} className={""} moose="2" hole={true} bum={true}/>
    )
}
