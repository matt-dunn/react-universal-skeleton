import styled from "@emotion/styled";

export const ButtonGroup = styled.div`
  > *:not(style) ~ *:not(style) {
    margin-left: 10px;
  }
`;

const ButtonBase = styled.button`
  padding: .375rem .75rem;
  min-height: 20px;
  line-height: 1.2;
  font-size: 1rem;

  &:not([disabled]) {
    cursor: pointer;
  }

  &[disabled] {
    opacity: 0.5;
  }
`;

export const Button = styled(ButtonBase)`
  background-color: #fff;
  color: #555;
  border-radius: .25rem;
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
  color: #3498DB;
  border: none;
`;

export const ButtonSimpleDanger = styled(ButtonSimple)`
  text-transform: uppercase;
`;

export const ButtonSimplePrimary = styled(ButtonSimple)`
  text-transform: uppercase;
`;
