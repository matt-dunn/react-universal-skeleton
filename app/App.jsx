import { hot } from 'react-hot-loader';
import React, {useEffect, useState} from 'react'

import myStyled from "components/myStyled";

const Fancy = ({children, className}) => {
    return (
        <div className={className}>
            Fancy:
            {children}
        </div>
    );
}

const Styled = myStyled(Fancy)`
    padding: ${({index}) => `${20 + ((index || 0) * 50)}px`};
    color: ${({color}) => color};
    border: 3px solid orange;
    ${({color, index}) => color === "blue" && index === 0 && `
        background-color: orange;
        font-weight: bold;
    `}
`;

const Styled2 = myStyled.address`
    border: 1px solid red;
    padding: 10px;
    color: #ccc;
`;

const App = () => {
    const [color, setColor] = useState("green");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setColor("blue")
        }, 2000);

        setTimeout(() => {
            setColor("violet")
            setIndex(index => index + 1)
        }, 4000)
    }, []);

    return (
        <Styled color={color} index={index}>
            {color}
            <Styled2>
                INNER: {color}
            </Styled2>
        </Styled>
    );
};

export default hot(module)(App);
