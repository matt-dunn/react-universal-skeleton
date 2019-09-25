import React from 'react';
import styled from 'styled-components'
import { NavLink } from 'react-router-dom';

const Container = styled.header`
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #eee;
  background-color: #f5f5f5;
`

const Brand = styled.h1`
  font-size: var(--step-up-1);
`

const Menu = styled.ul`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 50vw;
`

const MenuLink = styled.li`
  margin-left: 2em;
  text-decoration: none;
`

const Header = () => (
    <Container>
        <Brand>Universal App Test</Brand>
        <Menu>
            <MenuLink>
                <NavLink
                    to="/"
                    exact activeClassName="active"
                >Home</NavLink>
            </MenuLink>
            <MenuLink>
                <NavLink
                    to="/about"
                    exact activeClassName="active"
                >About</NavLink>
            </MenuLink>
        </Menu>
    </Container>
)

export default Header;
