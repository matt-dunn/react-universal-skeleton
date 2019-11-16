import styled from '@emotion/styled'

const Pulse = styled.div<{height: number}>`
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
    height: ${({height}) => `${height}px`};
    width: ${({height}) => `${height}px`};
    background-color: #999;
    top: 50%;
    left: 50%;
    margin: ${({height}) => `-${height / 2}px 0 0 -${height / 2}px`};
    border-radius: 100%;
    animation: sk-scaleout 1.0s infinite ease-in-out;
  }
`;

export default Pulse;
