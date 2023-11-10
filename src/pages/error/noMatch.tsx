import React from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  @import url(https://fonts.googleapis.com/css?family=Roboto:400,100,300,500);

  body {
    color: #fff;
    font-size: 100%;
    line-height: 1.5;
    font-family: "Roboto", sans-serif;
  }

  .button {
    font-weight: 300;
    color: #fff;
    font-size: 1.2em;
    text-decoration: none;
    border: 1px solid #efefef;
    padding: 0.5em;
    border-radius: 3px;
    float: left;
    margin: 6em 0 0 -155px;
    left: 50%;
    position: relative;
    transition: all 0.3s linear;
    background-color: #222;
    color: #fff;
  }

  p {
    font-size: 2em;
    text-align: center;
    font-weight: 100;
  }

  h1 {
    text-align: center;
    font-size: 15em;
    font-weight: 100;
    color: #222;
  }
`;
export const NoMatch = () => (
  <Wrapper>
    <h1>404</h1>
    <p>Oops! Something is wrong.</p>
    <a className="button" href="#">
      <i className="icon-home"></i> Go back in initial page, is better.
    </a>
  </Wrapper>
);
