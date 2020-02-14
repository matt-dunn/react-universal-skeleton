import React from "react";
import {Helmet} from "react-helmet-async";
// import styled from "@emotion/styled";
// import {NavLink} from "react-router-dom";
import loadable from "@loadable/component";

import {Main} from "app/styles/Components";

import {withWireFrameAnnotation} from "components/Wireframe/withWireFrameAnnotation";

// const Menu = styled.ul`
//   margin: 50px auto;
//   padding: 0 50px;
//   max-width: 500px;
// `;
//
// const MenuLink = styled.li`
//   a {
//     display: block;
//     padding: 20px;
//     background-color: #eee;
//     border-radius: 10px;
//     margin: 0 0 20px 0;
//     text-decoration: none;
//
//     &:hover {
//       background-color: #ccc;
//     }
//
//     aside {
//       margin-top: 10px;
//       line-height: 1.4;
//     }
//   }
// `;

const Markdown = loadable(() => import("components/markdown"));

// import Markdown from "../../components/markdown";
// import content from "mocks/content/test3.md";

const WAMarkdown = withWireFrameAnnotation(Markdown, {
    title: <div>Markdown</div>,
    description: <div>Ut a hendrerit ligula. Praesent vestibulum, dui venenatis convallis condimentum, lorem magna rutrum erat, eget convallis odio purus sed ex. Suspendisse congue metus ac blandit vehicula. Suspendisse non elementum purus.</div>
});

const Home = () => (
    <Main>
        <Helmet>
            <title>Home Page</title>
        </Helmet>

        {/*<Menu>*/}
        {/*    <MenuLink>*/}
        {/*        <NavLink*/}
        {/*            to="/data"*/}
        {/*            exact activeClassName="active"*/}
        {/*        >*/}
        {/*            <h2>*/}
        {/*                API SSR Example*/}
        {/*            </h2>*/}
        {/*            <aside>*/}
        {/*                Example of calling API endpoints on the client and server. Also demonstrates loading data for a component only when in the viewport.*/}
        {/*            </aside>*/}
        {/*        </NavLink>*/}
        {/*    </MenuLink>*/}
        {/*    <MenuLink>*/}
        {/*        <NavLink*/}
        {/*            to="/forms"*/}
        {/*            exact activeClassName="active"*/}
        {/*        >*/}
        {/*            <h2>*/}
        {/*                Schema Forms*/}
        {/*            </h2>*/}
        {/*            <aside>*/}
        {/*                Example of dynamically building responsive forms from a Yup schema with server side validation and processing. Forms can be rendered in a custom layout.*/}
        {/*            </aside>*/}
        {/*        </NavLink>*/}
        {/*    </MenuLink>*/}
        {/*</Menu>*/}

        <WAMarkdown content={import("../../README.md")} id={"md-1"}/>
        {/*<Markdown content={import("mocks/content/test2.md")} id={"md-2"}/>*/}
        {/*<Markdown content={import("mocks/content/test3.md")} id={"md-3"}/>*/}

        {/*<Content>*/}
        {/*    {(content) => <Markdown id="md-2" content={content.default || content}/>}*/}
        {/*</Content>*/}
    </Main>
);

export default Home;
