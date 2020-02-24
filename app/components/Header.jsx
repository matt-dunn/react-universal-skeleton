import React from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

import ExpandCollapse from "react-expand-collapse";

import {useAuthenticatedUser} from "./auth";
import {withWireFrameAnnotation} from "components/Wireframe/withWireFrameAnnotation";

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
  white-space: nowrap;
  
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
  border-radius: 2em;

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
    title: "Home",
    description:
        <ExpandCollapse
            previewHeight="82px"
        >
            Morbi tempor libero id accumsan sodales. Etiam maximus convallis faucibus. Nunc hendrerit sit amet ante in lobortis. Aliquam feugiat nibh sit amet nunc varius laoreet. Aliquam pharetra odio mi, sed convallis massa sagittis at. Nullam nibh tortor, commodo ac risus vitae, venenatis lobortis libero. Etiam ut sagittis velit, quis hendrerit nisi. Praesent interdum lacinia varius. Phasellus id felis non ex accumsan tempor. Nunc sit amet lobortis enim. Pellentesque lectus nulla, hendrerit dapibus efficitur id, imperdiet sit amet turpis. Maecenas venenatis suscipit finibus. Sed lorem nulla, dictum vel sollicitudin id, posuere eget nulla. Duis accumsan ante eget neque tincidunt pellentesque.
        </ExpandCollapse>
});

const WSData = withWireFrameAnnotation(HeaderLink, {
    title: "Data",
    description: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
});

const WSForms = withWireFrameAnnotation(HeaderLink, {
    title: "Forms",
    description: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
});

const WALocale = withWireFrameAnnotation(HeaderLink, {
    title: "Locale",
    description: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
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
