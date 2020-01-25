import React from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import {useAuthenticatedUser} from "./auth";
import {withWireFrameAnnotation} from "../../components/Wireframe";

const Container = styled.nav`
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #eee;
  background-color: #f5f5f5;
`;

const Brand = styled.header`
  font-size: var(--step-up-1);
`;

const Menu = styled.ul`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 50vw;
`;

const MenuLink = styled.li`
  margin-left: 2em;
  text-decoration: none;
`;

const WSHome = withWireFrameAnnotation(NavLink, {
    title: <div>Home</div>,
    description: <div>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const WSData = withWireFrameAnnotation(NavLink, {
    title: <div>Data</div>,
    description: <div>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const WSForms = withWireFrameAnnotation(NavLink, {
    title: <div>Forms</div>,
    description: <div>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const WALocale = withWireFrameAnnotation(NavLink, {
    title: <div>Locale</div>,
    description: <div>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const Header = () => {
    const authenticatedUser = useAuthenticatedUser();

    return (
        <Container>
            <Brand>Universal App Example {authenticatedUser && authenticatedUser.name} {authenticatedUser && <small>{authenticatedUser.email}</small>} </Brand>
            <Menu>
                <MenuLink>
                    <WSHome
                        to="/"
                        exact activeClassName="active"
                    >Home</WSHome>
                </MenuLink>
                <MenuLink>
                    <WSData
                        to="/data"
                        exact activeClassName="active"
                    >API SSR Example</WSData>
                </MenuLink>
                <MenuLink>
                    <WSForms
                        to="/forms"
                        exact activeClassName="active"
                    >Schema Forms</WSForms>
                </MenuLink>
                <MenuLink>
                    <WALocale
                        to="/locale"
                        exact activeClassName="active"
                    >Locale Test</WALocale>
                </MenuLink>
            </Menu>
        </Container>
    );
};

export default React.memo(Header);
