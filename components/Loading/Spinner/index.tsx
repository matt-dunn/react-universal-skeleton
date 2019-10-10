import styled from "styled-components";

import spinner from "./i/spinner.gif";

const Loader = styled.div`
  position: absolute;
  height: 50px;
  width: 50px;
  top: 50%;
  left: 50%;
  margin: -25px 0 0 -25px;
  background-size: 50px;
  z-index: -1;
  background-image: url(${spinner});
  background-repeat: no-repeat;
`;

export default Loader;
