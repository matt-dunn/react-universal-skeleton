import styled from "@emotion/styled";
import css from "@emotion/css";

export const global = css`
  .wf__annotations--hide {
      [data-annotation] {
        &:hover {
          > * {
            box-shadow: none !important;
          }
        }

        [data-annotation-identifier] {
          opacity: 0 !important;
          visibility: hidden;
        }
      }
  }
`;

export const IdentifierBase = styled.cite`
  border-radius: 50px;
  background-color: yellow;
  border-color: #FFD600;
  font-size: 1em;
  white-space: nowrap;
  width: 2em;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-weight: normal;
`;
