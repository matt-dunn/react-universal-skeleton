import React, {ReactNode, useContext, useEffect, useState, useCallback, useLayoutEffect} from "react";
import {Global} from "@emotion/core";
import css from "@emotion/css";
import styled from "@emotion/styled";
import scrollIntoView from "scroll-into-view-if-needed";

import {WireFrameAnnotationContext} from "./context";
import {WireFrameComponent, WireFrameComponents} from "./api";
import {global} from "./styles";

import useWhatChanged from "../whatChanged/useWhatChanged";
import {WireFrameAnnotationsNotes} from "./WireFrameAnnotationNotes";

type WireFrameProviderProps = {
    children: ReactNode;
}

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
  z-index: 6000;
  
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

export const WireFrameProvider = ({children}: WireFrameProviderProps) => {
    const api = useContext(WireFrameAnnotationContext);

    const [components, setComponents] = useState<WireFrameComponents>();
    const [show, setShow] = useState(true);
    const [highlightedNote, setHighlightedNote] = useState<WireFrameComponent | undefined>(undefined);

    const highlightNote = useCallback(wireFrameComponent => show && setHighlightedNote(wireFrameComponent), [show]);

    const handleToggle = useCallback(() => {
        setShow(show => !show);
    }, []);

    const handleClose = useCallback(() => {
        setShow(false);
    }, []);

    useLayoutEffect(() => {
        api.setOptions({
            updater: setComponents,
            highlightNote
        });
    }, [api, highlightNote]);

    useEffect(() => {
        if (show) {
            document.body.classList.add("wf__annotations--show");
        } else {
            document.body.classList.remove("wf__annotations--show");
        }

        return () => {
            document.body.classList.remove("wf__annotations--show");
        };
    }, [show]);

    useEffect(() => {
        if (highlightedNote) {
            const el = document.querySelector(`#wf-annotation-${highlightedNote.id}`);

            el && scrollIntoView(el, {
                behavior: "smooth",
                scrollMode: "if-needed",
                boundary: document.getElementById("wf-annotations"),
            });
        }
    }, [highlightedNote]);

    useWhatChanged(WireFrameProvider, { api, handleToggle, handleClose, components, show, highlightedNote, highlightNote});

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
                        {components && <WireFrameAnnotationsNotes
                            components={components}
                            highlightedNote={highlightedNote}
                        />}
                    </WireFrameAnnotations>
                </WireFrameAnnotationsContainer>
            </WireFrameContainer>
        </WireFrameAnnotationContext.Provider>
    );
};

