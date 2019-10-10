import styled from "styled-components";

const Pulse = styled.div`
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

  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  
  &:after {
    position: absolute;
    content: ' ';
    width: 50px;
    height: 50px;
    background-color: #999;
    top: 50%;
    left: 50%;
    margin: -25px 0 0 -25px;
    border-radius: 100%;
    animation: sk-scaleout 1.0s infinite ease-in-out;
  }
`;

export default Pulse;
