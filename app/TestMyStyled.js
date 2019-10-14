import React, {useEffect, useState} from 'react'
import PropTypes from "prop-types";

import myStyled from "components/myStyled";
// import myStyled from "styled-components";

const Fancy = ({children, className}) => {
    return (
        <div className={className}>
            Fancy:
            {children}
        </div>
    );
}

Fancy.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    className: PropTypes.string
};

const Styled = myStyled(Fancy)`
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
        margin: ${({index}) => `${20 + ((index || 0) * 50)}px`};
    }

    @media only screen and (max-width: 1000px) {
        && {
            border: 10px solid ${({color}) => color};
        }
    }
    
    margin-top: 100px;
`;

const Styled2 = myStyled.address`
    border: 1px solid red;
    padding: 10px;

    &:hover {
        background-color: red;
    }
`;

const Styled3 = myStyled(Styled2)`
    font-size: 20px;
`;

const v = "bold"
const Styled4 = myStyled(Styled3)`
    font-weight: ${v};
`;

const TestMyStyled = () => {
    const [color, setColor] = useState("green");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        console.log("READY");

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
            <Styled4 className="my-lovely-horse">
                INNER: {color}
            </Styled4>
        </Styled>
    );
};

export default TestMyStyled;
