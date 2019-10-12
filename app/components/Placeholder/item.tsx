import styled, {AnyStyledComponent} from "styled-components";

const PlaceHolderItem = (Component: AnyStyledComponent) => styled(Component)`
  position: relative;
  min-height: calc(1.75em + 5px);

  &:before {
    position: absolute;
    left: 10px;
    top: 10px;
    background-color: rgba(222, 226, 230, 0.4);
    border-radius: 0.25rem;
    width: 55%;
    height: 0.75em;
    content: " ";
  }

  &:after {
    position: absolute;
    left: 10px;
    top: 10px;
    margin-top: 1.1em;
    background-color: rgba(222, 226, 230, 0.4);
    border-radius: 0.25rem;
    width: 85%;
    height: 1em;
    content: " ";
  }
`;

export default PlaceHolderItem;
