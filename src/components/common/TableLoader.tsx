import React from "react";
import styled from "styled-components";

const Styles = styled.div`
  .loading {
    height: 200px;
  }
  .cs-loader {
    position: absolute;
    top: 15%;
    left: 5%;
    height: 100%;
    width: 100%;
  }

  .cs-loader-inner {
    transform: translateY(-50%);
    top: 50%;
    position: absolute;
    width: calc(100% - 200px);
    color: #1b2e57;
    padding: 0 100px;
    text-align: center;
  }

  .cs-loader-inner label {
    font-size: 20px;
    opacity: 0;
    display: inline-block;
  }

  @keyframes lol {
    0% {
      opacity: 0;
      transform: translateX(-300px);
    }
    33% {
      opacity: 1;
      transform: translateX(0px);
    }
    66% {
      opacity: 1;
      transform: translateX(0px);
    }
    100% {
      opacity: 0;
      transform: translateX(300px);
    }
  }

  @-webkit-keyframes lol {
    0% {
      opacity: 0;
      -webkit-transform: translateX(-300px);
    }
    33% {
      opacity: 1;
      -webkit-transform: translateX(0px);
    }
    66% {
      opacity: 1;
      -webkit-transform: translateX(0px);
    }
    100% {
      opacity: 0;
      -webkit-transform: translateX(300px);
    }
  }

  .cs-loader-inner label:nth-child(6) {
    -webkit-animation: lol 1s infinite ease-in-out;
    animation: lol 1s infinite ease-in-out;
  }

  .cs-loader-inner label:nth-child(5) {
    -webkit-animation: lol 1s 10ms infinite ease-in-out;
    animation: lol 1s 10ms infinite ease-in-out;
  }

  .cs-loader-inner label:nth-child(4) {
    -webkit-animation: lol 1s 20ms infinite ease-in-out;
    animation: lol 1s 20ms infinite ease-in-out;
  }

  .cs-loader-inner label:nth-child(3) {
    -webkit-animation: lol 1s 30ms infinite ease-in-out;
    animation: lol 1s 30ms infinite ease-in-out;
  }

  .cs-loader-inner label:nth-child(2) {
    -webkit-animation: lol 1s 40ms infinite ease-in-out;
    animation: lol 1s 40ms infinite ease-in-out;
  }

  .cs-loader-inner label:nth-child(1) {
    -webkit-animation: lol 1s 50ms infinite ease-in-out;
    animation: lol 1s 50ms infinite ease-in-out;
  }
`;
const TableLoader = () => {
  return (
    <Styles>
      <div className="loading">
        <div className="cs-loader">
          <div className="cs-loader-inner">
            <label>●</label>
            <label>●</label>
            <label>●</label>
            <label>●</label>
            <label>●</label>
            <label>●</label>
          </div>
        </div>
      </div>
    </Styles>
  );
};

export default TableLoader;
