import { hot } from 'react-hot-loader';
import React, {useState} from 'react'
import ReactDOM from 'react-dom';
import {Helmet} from 'react-helmet-async';
import {Switch, Route, generatePath} from 'react-router-dom'
import importComponent from 'react-imported-component';
import styled, {css} from "styled-components";

import Header from './components/Header'

import Error403 from './pages/403';
import Error404 from './pages/404';

import Home from './pages/Home';
import LoadingComponent from './pages/Loading'
import ErrorComponent from './pages/Error'

import { GlobalStyles } from './styles'
import { ToastifyStyles } from './styles/toasify'

import ErrorHandler from "components/actions/ErrorHandler";

const About = importComponent(() => import("./pages/About"), {
    LoadingComponent,
    ErrorComponent
});

const Login = importComponent(() => import("./pages/Login"), {
    LoadingComponent,
    ErrorComponent
});

const handler = ({code, status}, location, history, props) => {
    console.log("HANDLE ERROR", code, status, location, history)

    if (status === 401) {
        history.push(generatePath("/login/:from?", {from: location}))
        return true;
    } else if (status === 403) {
        return <Error403/>;
    } else if (status === 404) {
        return <Error404/>;
    }
}

import AuthProvider from "./components/auth"

// Parcel seems to need the node_modules path prefixed otherwise server bundle get Unexpected Token error... :(
import '/node_modules/react-responsive-ui/style.css';

const sheet = (function() {
    if(document.getElementById("mystyled")) {
        return document.getElementById("mystyled").sheet
    }
    const style = document.createElement("style");
    style.setAttribute("id", "mystyled")

    // WebKit hack :(
    style.appendChild(document.createTextNode(""));

    document.head.appendChild(style);

    return style.sheet;
})();

function getStyleIndex(sheet, className) {
    const classes = sheet.rules || sheet.cssRules;

    for (let x = 0; x < classes.length; x++) {
        if (classes[x].selectorText === className) {
            return x;
        }
    }

    return -1;
}

const createHash = s => s.split("").reduce((a, b) => {a = ((a << 5) - a) + b.charCodeAt(0);return a & a},0)

import {isFunction} from "lodash";

const parsedRule = (strings, args, props) => strings.reduce((rule, part, index) => {
    rule.push(part);

    const arg = args[index];
    const value = isFunction(arg) ? arg(props) : arg;
    value && rule.push(value);

    return rule;
}, []).join("");

const myStyled = Component => (strings, ...args) => {
    let prevClassName;
    let prevHash;

    const updateRule = props => {
        const rule = parsedRule(strings, args, props);
        const hash = createHash(rule);

        if (hash === prevHash) {
            return prevClassName;
        }

        const oldIndex = getStyleIndex(sheet, `.${prevClassName}`);
        oldIndex !== -1 && sheet.deleteRule(oldIndex);

        const className = `${Component.displayName || Component.name || Component.type || Component}__${hash}`;

        prevClassName = className;
        prevHash = hash;

        const index = getStyleIndex(sheet, `.${className}`);

        index !== -1 && sheet.deleteRule(index);

        sheet.insertRule(
            `.${className} {${rule}}`,
            index === -1 ? 0 : index
        );

        return className;
    };

    return ({children, ...props}) => React.createElement(Component, {...props, className: updateRule(props)}, children);
}

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
    const [color, setColor] = useState("green")
    const [index, setIndex] = useState(0)

    setTimeout(() => {
        setColor("blue")
    }, 2000)

    // setTimeout(() => {
    //     setColor("yellow")
    //     // setIndex(index + 1)
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
