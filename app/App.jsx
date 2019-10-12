import { hot } from 'react-hot-loader';
import React, {useState} from 'react'

import myStyled from "./myStyled";

const Fancy = ({children, className}) => {
    return (
        <div className={className}>
            Fancy:
            {children}
        </div>
    );
}

const Styled = myStyled(Fancy)`
    padding: ${({index}) => `${100 + ((index || 1) * 5)}px`};
    color: ${({color}) => color};
    border: 10px solid orange;
    ${({color}) => color === "blue" && `
        background-color: orange;
        font-weight: bold;
    `};
`;

const Styled2 = myStyled("div")`
    border: 1px solid red;
    padding: 10px;
    color: yellow;
`;

const App = () => {
    const [color, setColor] = useState("green");
    const [index, setIndex] = useState(0);

    setTimeout(() => {
        setColor("blue")
    }, 2000);

    // setTimeout(() => {
    //     // setColor("yellow")
    //     setIndex(index + 1)
    // }, 3000)

    return (
        <Styled color={color} index={index}>
            {color}
            <Styled2>
                INNER: {color}
            </Styled2>
        </Styled>
    );
}

export default hot(module)(App);
