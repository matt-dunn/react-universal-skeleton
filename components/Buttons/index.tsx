import styled from "@emotion/styled";

export const Button = styled.button`
  padding: 6px 15px;
  min-height: 20px;
  line-height: 1.2;
  background-color: #fff;
  color: #555;
  border-radius: 3px;
  font-size: 1.4rem;
  
  &[disabled] {
    opacity: 0.5;
  }

  +button {
    margin-left: 10px;
  }
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
