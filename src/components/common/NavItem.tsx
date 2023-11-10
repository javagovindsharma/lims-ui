import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styled from "styled-components";
import React from "react";

interface styling {
  active: boolean;
  path: string;
  onItemClick: Function;
}

interface NavProps {
  active: boolean;
  name: string;
  onItemClick: Function;
  path: string;
  css: string;
}
interface NavState {
  value: string;
}

export default class NavItem extends React.Component<NavProps, NavState> {
  constructor(props: NavProps) {
    super(props);
    //this.state: NavState = {value:""};
  }

  handleClick = () => {
    const { path, onItemClick } = this.props;
    onItemClick(path);
  };
  render() {
    const { active, css, path } = this.props;
    const StyledNavItem = styled.div`
      height: 70px;
      width: 75px; /* width must be same size as NavBar to center */
      text-align: center; /* Aligns <a> inside of NavIcon div */
      margin-bottom: 0; /* Puts space between NavItems */
      a {
        font-size: 2em;
        color: ${active ? "orange" : "white"};
        :hover {
          opacity: 0.7;
          text-decoration: none; /* Gets rid of underlining of icons */
        }
      }
    `;

    const NavIcon = styled.div`
      display: block;
      margin-top: 10px;
    `;

    return (
      <StyledNavItem>
        <Link to={path} className={css} onClick={this.handleClick}>
          <NavIcon></NavIcon>
        </Link>
      </StyledNavItem>
    );
  }
}
