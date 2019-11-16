import styled from '@emotion/styled'

const PlaceHolderItem = (Component: any) => styled(Component)`
  position: relative;
  min-height: calc(1.75em + 5px);

  &:before {
    position: absolute;
    left: 10px;
    top: 10px;
    background-color: currentColor;
    opacity: 0.4;
    border-radius: 0.25rem;
    width: calc(55% - 20px);
    height: 0.75em;
    content: " ";
  }

  &:after {
    position: absolute;
    left: 10px;
    top: 10px;
    margin-top: 1.1em;
    background-color: currentColor;
    opacity: 0.4;
    border-radius: 0.25rem;
    width: calc(100% - 20px);
    height: 1em;
    content: " ";
  }
`;

export default PlaceHolderItem;
