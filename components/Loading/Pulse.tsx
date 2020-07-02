import React from "react";
import styled from "@emotion/styled";

export const Pulse = styled.div`
  @-webkit-keyframes sk-scaleout {
    0% {
      -webkit-transform: scale(0)
    }
    100% {
      -webkit-transform: scale(1.0);
      opacity: 0;
    }
  }
    
  @keyframes sk-scaleout {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    100% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
      opacity: 0;
    }
  }

  width: 100%;
  height: 100%;
  
  &:after {
    position: absolute;
    content: ' ';
    height: 100%;
    width: 100%;
    background-color: #999;
    border-radius: 100%;
    animation: sk-scaleout 1.0s infinite ease-in-out;
  }
`;

export const PulseLoader = () => <Pulse/>;
