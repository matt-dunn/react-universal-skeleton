import React, {ReactNode, useContext, useEffect, useState, useCallback, useMemo} from "react";
import css from "@emotion/css";
import styled from "@emotion/styled";
import scrollIntoView from "scroll-into-view-if-needed";

import {WireFrameAnnotationContext} from "../context";
import {WireFrameComponent, WireFrameComponents} from "../api";
import {WireFrameAnnotationsNotes} from "../WireFrameAnnotationNotes";

type WireFrameProviderProps = {
    children: ReactNode;
}

const WireFrameContainer = styled.div`
  display: flex;
`;

const WireFrameBody = styled.div`
  flex-grow: 1;
`;

const transition = "250ms ease-in-out";

const WireFrameAnnotationsContainer = styled.div<{open: boolean}>`
  flex-grow: 0;
  flex-shrink: 0;
  max-width: 400px;
  padding: 0;
  transition: width ${transition}, min-width ${transition};

  ${({open = true}) => {
    if (open) {
        return css`
            width: 25%;
            min-width: 250px;

            [data-annotations-toggle] {
                span {
                  transform: rotate(180deg);
                }
            }
        `;
    } else {
        return css`
            width: 0;
            min-width: 0;
            
            [data-annotations] {
              transform: translateX(100%);
            }
        `;
    }
}};
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
  transition: transform ${transition};
  z-index: 6000;
  
  > header {
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

const useWireFrame = () => {
    const api = useContext(WireFrameAnnotationContext);

    const [components, setComponents] = useState<WireFrameComponents>();
    const [highlightedNote, setHighlightedNote] = useState<WireFrameComponent | undefined>(undefined);
    const [open, setShow] = useState(false);

    useMemo(() => {
        api.setOptions({
            updater: setComponents,
            highlightNote: wireFrameComponent => open && setHighlightedNote(wireFrameComponent)
        });
        api.setOpen(open);
    }, [api, open]);

    return {api, components, highlightedNote, open, setShow};
};

export const WireFrameProvider = ({children}: WireFrameProviderProps) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const {api, components, highlightedNote, open, setShow} = useWireFrame();

    const handleToggle = useCallback(() => {
        setShow(open => !open);
    }, [setShow]);

    const handleClose = useCallback(() => {
        setShow(false);
    }, [setShow]);

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

    return (
        <WireFrameAnnotationContext.Provider value={api}>
            <WireFrameContainer>
                <WireFrameBody>
                    {children}
                </WireFrameBody>

                {(components && isClient) &&
                <WireFrameAnnotationsContainer open={open}>
                    <WireFrameAnnotations data-annotations>
                        <WireFrameAnnotationsToggle data-annotations-toggle aria-label="Toggle annotations" onClick={handleToggle}>
                            <span>⬅</span>
                        </WireFrameAnnotationsToggle>

                        <header>
                            <h1>Annotations</h1>
                            <WireFrameAnnotationsClose aria-label="Close annotations" onClick={handleClose}>×</WireFrameAnnotationsClose>
                        </header>

                        <WireFrameAnnotationsNotes
                            components={components}
                            highlightedNote={highlightedNote}
                        />
                    </WireFrameAnnotations>
                </WireFrameAnnotationsContainer>
                }
            </WireFrameContainer>
        </WireFrameAnnotationContext.Provider>
    );
};

