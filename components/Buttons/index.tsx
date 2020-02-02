import styled from "@emotion/styled";

const ButtonBase = styled.button`
  &:not([disabled]) {
    cursor: pointer;
  }

  &[disabled] {
    opacity: 0.5;
  }

  +button {
    margin-left: 10px;
  }
`;

export const Button = styled(ButtonBase)`
  padding: 6px 15px;
  min-height: 20px;
  line-height: 1.2;
  background-color: #fff;
  color: #555;
  border-radius: .25rem;
  font-size: 1.4rem;
`;

export const ButtonDanger = styled(Button)`
  background-color: #e20020;
  border-color: #e20020;
  color: #fff;
  text-transform: uppercase;
`;

export const ButtonPrimary = styled(Button)`
  background-color: #3498DB;
  border-color: #3498DB;
  color: #fff;
  text-transform: uppercase;
`;

export const ButtonSimple = styled(ButtonBase)`
  padding: 6px 5px;
  min-height: 20px;
  line-height: 1.2;
  font-size: 1.4rem;
  font-weight: bold;
  color: #3498DB;
  border: none;
`;

export const ButtonSimpleDanger = styled(ButtonSimple)`
  text-transform: uppercase;
`;

export const ButtonSimplePrimary = styled(ButtonSimple)`
  text-transform: uppercase;
`;
