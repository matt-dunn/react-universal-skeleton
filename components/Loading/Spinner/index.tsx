import styled from "styled-components";

import spinner from "./i/spinner.gif";

const Loader = styled.div<{height: number}>`
  position: absolute;
  height: ${({height}) => `${height}px`};
  width: ${({height}) => `${height}px`};
  top: 50%;
  left: 50%;
  margin: ${({height}) => `-${height / 2}px 0 0 -${height / 2}px`};
  background-size: ${({height}) => `${height}px`};
  z-index: -1;
  background-image: url(${spinner});
  background-repeat: no-repeat;
`;

export default Loader;
