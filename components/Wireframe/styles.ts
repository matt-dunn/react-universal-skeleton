import styled from "@emotion/styled";
import css from "@emotion/css";

export const global = css`
  [data-annotation-identifier] {
    visibility: hidden;
    opacity: 0;
  }

  .wf__annotations--open {
      [data-annotation] {
        &:hover {
          z-index: 5000;
          
          > * {
            box-shadow: 0 0 0 1px #4086f7 !important;
          }
        }

        [data-annotation-identifier] {
            transition: opacity 250ms, visibility 250ms;
            opacity: 0.75;
            visibility: visible;
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
