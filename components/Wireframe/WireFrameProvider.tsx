import React, {ReactNode, useContext, useEffect, useState} from "react";
import {Global} from "@emotion/core";
import css from "@emotion/css";
import styled from "@emotion/styled";

import {WireFrameAnnotationContext} from "./context";
import {WireFrameComponents} from "./api";
import {IdentifierBase} from "./styles";

import useWhatChanged from "../whatChanged/useWhatChanged";

type WireFrameProviderProps = {
    children: ReactNode;
}

const global = css`
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

const IdentifierNote = styled(IdentifierBase)`
  margin-right: 0.5em;
`;

const WireFrameContainer = styled.div<{show: boolean}>`
  display: flex;

  ${({show = true}) => {
    if (show) {
        return css`
              [data-annotations-container] {
                  width: 25%;
                  min-width: 250px;
                  
                  [data-annotations-toggle] {
                    span {
                      transform: rotate(180deg);
                    }
                  }
              }
          `;
    } else {
        return css`
              [data-annotations-container] {
                  width: 0;
                  min-width: 0;
                  
                  [data-annotations] {
                    transform: translateX(100%);
                  }
              }
          `;
    }
}};
`;

const WireFrameBody = styled.div`
  flex-grow: 1;
`;

const WireFrameAnnotationsContainer = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  max-width: 400px;
  padding: 0;
  transition: width 250ms, min-width 250ms;

`;

const WireFrameAnnotations = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  border-left: 2px solid #555;
  padding: 0;
  width: 25%;
  max-width: 400px;
  min-width: 250px;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  font-size: 1.2rem;
  transition: transform 250ms;
  
  > header {
    margin-bottom: 1em;
    padding: 3px 10px;
    background-color: #555;
    color: #fff;
    display: flex;
    
    h1 {
      flex-grow: 1;
    }
  }
`;

const WireFrameAnnotationsToggle = styled.div`
  position: absolute;
  left: -1px;
  top: 50%;
  background-color: #555;
  color: #fff;
  padding: 5px;
  border-radius: 5px 0 0 5px;
  transform: translate(-100%, -50%);
  min-height: 3em;
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    transition: transform 250ms;
    display: block;
  }
`;

const WireFrameAnnotationsClose = styled.button`
  flex-grow: 0;
  cursor: pointer;
  line-height: 1;
  font-size: 2em;
  background-color: transparent;
  border: none;
  padding: 0;
  color: inherit;
`;

const WireFrameAnnotationsNotes = styled.ul`
  overflow: auto;
  padding-bottom: 10px;
  
  li {
    margin: 0 0 10px 0;
    padding: 0 0 10px 0;
    border-bottom: 1px solid #ccc;
    
    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    
    header {
      display: flex;
      padding: 0 10px;
    }
    
    article {
      padding: 0 10px;
    }
  }
`;

export const WireFrameProvider = ({children}: WireFrameProviderProps) => {
    const api = useContext(WireFrameAnnotationContext);
    const [components, setComponents] = useState<WireFrameComponents>();
    const [show, setShow] = useState(false);

    useEffect(() => {
        api.setOptions({
            updater: setComponents
        });
    }, []);

    useEffect(() => {
        if (show) {
            document.body.classList.remove("wf__annotations--hide");
        } else {
            document.body.classList.add("wf__annotations--hide");
        }

        return () => {
            document.body.classList.remove("wf__annotations--hide");
        };
    }, [show]);

    const handleToggle = () => {
        setShow(show => !show);
    };

    const handleClose = () => {
        setShow(false);
    };

    useWhatChanged(WireFrameProvider, { handleToggle, handleClose, components, show});

    return (
        <WireFrameAnnotationContext.Provider value={api}>
            <Global
                styles={global}
            />
            <WireFrameContainer show={show}>
                <WireFrameBody>
                    {children}
                </WireFrameBody>
                <WireFrameAnnotationsContainer data-annotations-container>
                    <WireFrameAnnotations data-annotations>
                        <WireFrameAnnotationsToggle data-annotations-toggle aria-label="Toggle annotations" onClick={handleToggle}>
                            <span>⬅</span>
                        </WireFrameAnnotationsToggle>
                        <header>
                            <h1>Annotations</h1>
                            <WireFrameAnnotationsClose aria-label="Close annotations" onClick={handleClose}>×</WireFrameAnnotationsClose>
                        </header>
                        <WireFrameAnnotationsNotes>
                            {components && components.map(component => {
                                return (
                                    <li key={component.id}>
                                        <header>
                                            <IdentifierNote>{component.id}</IdentifierNote>
                                            <h2>
                                                {component.options.title}
                                            </h2>
                                        </header>
                                        <article>
                                            {component.options.description}
                                        </article>
                                    </li>
                                );
                            })}
                        </WireFrameAnnotationsNotes>
                    </WireFrameAnnotations>
                </WireFrameAnnotationsContainer>
            </WireFrameContainer>
        </WireFrameAnnotationContext.Provider>
    );
};

