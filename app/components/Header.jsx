import React from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import {useAuthenticatedUser} from "./auth";
import {withWireFrameAnnotation} from "../../components/Wireframe";

const Container = styled.nav`
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #eee;
  background-color: #f5f5f5;
  min-height: 80px;
`;

const Brand = styled.header`
  font-size: var(--step-up-1);
  margin: 5px 20px;
`;

const Menu = styled.ul`
  margin: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const MenuLink = styled.li`
  margin-right: 0.5em;
  
  &:last-child {
    margin-right: 0;
  }
`;

const AuthenticatedUser = styled.div`
  font-size: 0.65em;
`;

const HeaderLink = styled(NavLink)`
  padding: 8px 15px;
  text-decoration: none;
  border-radius: 1em;

  &:focus,  
  &:hover {
    background-color: #ddd;
  }
  
  &.active {
    background-color: #555;
    color: #fff;
    pointer-events: none;
  }
`;

const WSHome = withWireFrameAnnotation(HeaderLink, {
    title: <div>Home</div>,
    description: <div>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const WSData = withWireFrameAnnotation(HeaderLink, {
    title: <div>Data</div>,
    description: <div>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const WSForms = withWireFrameAnnotation(HeaderLink, {
    title: <div>Forms</div>,
    description: <div>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const WALocale = withWireFrameAnnotation(HeaderLink, {
    title: <div>Locale</div>,
    description: <div>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>
});

const Header = () => {
    const authenticatedUser = useAuthenticatedUser();

    return (
        <Container>
            <Brand>
                Universal Skeleton Stack
                {authenticatedUser &&
                    <AuthenticatedUser>
                        {authenticatedUser.name}
                        <em>({authenticatedUser.email})</em>
                    </AuthenticatedUser>
                }
            </Brand>
            <Menu>
                <MenuLink>
                    <WSHome
                        to="/"
                        exact
                        activeClassName="active"
                    >Home</WSHome>
                </MenuLink>
                <MenuLink>
                    <WSData
                        to="/data/"
                        activeClassName="active"
                    >API SSR Example</WSData>
                </MenuLink>
                <MenuLink>
                    <WSForms
                        to="/forms/"
                        exact
                        activeClassName="active"
                    >Schema Forms</WSForms>
                </MenuLink>
                <MenuLink>
                    <WALocale
                        to="/locale/"
                        exact
                        activeClassName="active"
                    >Locale Test</WALocale>
                </MenuLink>
            </Menu>
        </Container>
    );
};

export default React.memo(Header);
