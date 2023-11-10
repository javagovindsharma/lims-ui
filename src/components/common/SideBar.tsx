import React from "react";
import styled from "styled-components";
import NavItem from "./NavItem";
/* This defines the actual bar going down the screen */
const StyledSideNav = styled.div`
  position: fixed; /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
  height: 100%;
  width: 75px; /* Set the width of the sidebar */
  z-index: 1; /* Stay on top of everything */
  top: 3.4em; /* Stay at the top */
  background-color: #222; /* Black */
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 10px;
`;

interface SideProps {}
interface items {
  path: string;
  name: string;
  css: string;
  key: number;
}
interface SideState {
  activePath: string;
  items: Array<items>;
}

class SideNav extends React.Component<SideProps, SideState> {
  constructor(props: SideProps) {
    super(props);

    this.state = {
      activePath: "/",
      items: [
        {
          path: "/" /* path is used as id to check which NavItem is active basically */,
          name: "Home",
          css: "fa fa-fw fa-home",
          key: 1 /* Key is required, else console throws error. Does this please you Mr. Browser?! */,
        },
        {
          path: "/upload",
          name: "Upload",
          css: "fa fa-fw fa-clock",
          key: 2,
        },
        {
          path: "/NoMatch",
          name: "NoMatch",
          css: "fas fa-hashtag",
          key: 3,
        },
      ],
    };
  }
  onItemClick = (path: string) => {
    this.setState({
      activePath: path,
    }); /* Sets activePath which causes rerender which causes CSS to change */
  };
  render() {
    return (
      <StyledSideNav>
        {
          /* items = just array AND map() loops thru that array AND item is param of that loop */
          this.state.items.map((item) => {
            /* Return however many NavItems in array to be rendered */
            return (
              <NavItem
                path={item.path}
                name={item.name}
                css={item.css}
                onItemClick={this.onItemClick}
                /* Simply passed an entire function to onClick prop */ active={
                  item.path === this.state.activePath
                }
                key={item.key}
              />
            );
          })
        }
      </StyledSideNav>
    );
  }
}

export default class Sidebar extends React.Component<SideProps, SideState> {
  render() {
    return <SideNav></SideNav>;
  }
}

/*
import React from "react";
import {Nav} from "react-bootstrap";
import { withRouter } from "react-router";
//import '../pages/style/Dashboard.css'

interface Menu {
    name:string,
    path:string
}

const Side = ()=> {
   

    return (
        <>
    
            <Nav className="col-md-12 d-none d-md-block bg-light sidebar"
            activeKey="/home"
            onSelect={selectedKey => alert(`selected ${selectedKey}`)}
            >
                <div className="sidebar-sticky"></div>
            <Nav.Item>
                <Nav.Link href="/home">Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-1">Link</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-2">Link</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                Disabled
                </Nav.Link>
            </Nav.Item>
            </Nav>
          
        </>
        );
  };
  const Sidebar = withRouter(Side);
  export default Sidebar
  */
