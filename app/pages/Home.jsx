import React from 'react'
import {Helmet} from 'react-helmet-async'
import styled from "styled-components";
import {NavLink} from "react-router-dom";

import Page from '../styles/Page'

const Menu = styled.ul`
  margin: 50px auto;
  padding: 0 50px;
  max-width: 500px;
`

const MenuLink = styled.li`
  a {
    display: block;
    padding: 20px;
    background-color: #eee;
    border-radius: 10px;
    margin: 0 0 20px 0;
    text-decoration: none;
    
    &:hover {
      background-color: #ccc;
    }
    
    aside {
      margin-top: 10px;
      line-height: 1.4;
    }
  }
`

const Home = () => {
    return (
        <Page>
            <Helmet>
                <title>Home Page</title>
            </Helmet>

            <Menu>
                <MenuLink>
                    <NavLink
                        to="/data"
                        exact activeClassName="active"
                    >
                        <h2>
                            API SSR Example
                        </h2>
                        <aside>
                            Example of calling API endpoints on the client and server. Also demonstrates loading data for a component only when in the viewport.
                        </aside>
                    </NavLink>
                </MenuLink>
                <MenuLink>
                    <NavLink
                        to="/forms"
                        exact activeClassName="active"
                    >
                        <h2>
                            Schema Forms
                        </h2>
                        <aside>
                            Example of dynamically building responsive forms from a Yup schema with server side validation and processing. Forms can be rendered in a custom layout.
                        </aside>
                    </NavLink>
                </MenuLink>
            </Menu>
        </Page>
    )
};

export default Home
