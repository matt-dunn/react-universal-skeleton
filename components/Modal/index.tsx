import styled from "@emotion/styled";
import React, {
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
    ReactText,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {createPortal} from "react-dom";
import {CSSTransition} from "react-transition-group";

const modalRoot = typeof document !== "undefined" && document.body;

const ModalContainer = styled.div`
  position: fixed;
  padding: 20px;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.25);

  &.fade.enter {
    opacity: 0;
  }
  &.fade.enter-active {
    opacity: 1;
    transition: opacity 250ms;
  }
  &.fade.exit {
    opacity: 1;
  }
  &.fade.exit-active {
    opacity: 0;
    transition: opacity 250ms;
  }
`;

const ModalDialog = styled.div`
  width: 40em;
  min-height: 10em;
  background-color: #ffff;
  margin: 3em auto;
  max-width: 100%;
  border-radius: 10px;
  border: 2px solid #999;
  display: flex;
  flex-direction: column;
`;

const ModalTitleContainer = styled.div`
  padding: 5px 15px;
  background-color: #999;
  color: #fff;
  flex-grow: 0;
  font-size: 1.5em;
  font-weight: lighter;
  display: flex;
  flex-wrap: nowrap;
`;

const ModalTitleBodyContainer = styled.div`
  flex-grow: 1;
`;

const ModalCloseContainer = styled.div`
  flex-grow: 0;
  cursor: pointer;
  line-height: 1;
`;

const ModalBodyContainer = styled.div`
  padding: 10px 15px;
  flex-grow: 1;
`;

const ModalFooterContainer = styled.div`
  padding: 5px 15px;
  border-top: 1px solid #ccc;
  flex-grow: 0;
`;

const ModalClose = ({onClose}: {onClose?: () => any}) => <ModalCloseContainer aria-label="Close" onClick={onClose}>×</ModalCloseContainer>;

export const ModalTitle = ({children, onClose}: {children: ReactNode; onClose?: () => any}) => {
    return (
        <ModalTitleContainer>
            <ModalTitleBodyContainer>
                {children}
            </ModalTitleBodyContainer>
            <ModalClose onClose={onClose}/>
        </ModalTitleContainer>
    );
};

export const ModalFooter = ({children}: {children: ReactNode}) =>
    <ModalFooterContainer>
        {children}
    </ModalFooterContainer>;

type ModalComponents = {
    Title?: ReactElement;
    Footer?: ReactElement;
    rest: ReactNode[];
}

const handleDialogClick = (e: SyntheticEvent): void => e.stopPropagation();

export const Modal = ({children, open = false, onClose, onClosed}: {children: ReactNode | ReactNode[]; open: boolean; onClose?: () => any; onClosed?: () => any}) => {
    const el = useRef<HTMLDivElement | undefined>((typeof document !== "undefined" && document.createElement("div") || undefined));

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const element = el.current;

        element && modalRoot && modalRoot.appendChild(element);

        return () => {
            element && modalRoot && modalRoot.removeChild(element);
        };
    }, []);

    const {Title, Footer, rest} = useMemo<ModalComponents>(() => React.Children.toArray((isValidElement(children) && children.type === React.Fragment && children.props.children) || children).reduce((types: ModalComponents, child: ReactNode) => {
        if (isValidElement(child) && child.type === ModalTitle) {
            types.Title = child;
        } else if (isValidElement(child) && child.type === ModalFooter) {
            types.Footer = child;
        } else {
            types.rest.push(child);
        }

        return types;
    }, {
        Title: undefined,
        Footer: undefined,
        rest: []
    }), [children]);

    return (isClient && el.current && createPortal(
        <CSSTransition
            timeout={250}
            className="fade"
            in={open}
            mountOnEnter={true}
            unmountOnExit={true}
            onExited={onClosed}
        >
            <ModalContainer onClick={onClose}>
                <ModalDialog onClick={handleDialogClick}>
                    {Title && cloneElement(Title, {onClose})}
                    <ModalBodyContainer>
                        {rest}
                    </ModalBodyContainer>
                    {Footer}
                </ModalDialog>
            </ModalContainer>
        </CSSTransition>,
        el.current
    )) || null;
};

type PromiseLike<T = any> = {
    then: (cb: () => T) => void
}

type ModalBaseProps = {
    open: boolean;
}

interface ModalAdditionalProps {
    hasClose?: boolean;
}

type ModalProps = ModalBaseProps & ModalAdditionalProps;

type HandleOpen = {
    (content: ReactNode | ReactText, options?: ModalAdditionalProps): PromiseLike
}

type HandleClose = {
    (): void
}

type useModal = [
    ReactElement,
    HandleOpen,
    HandleClose
]

export const useModal = (): useModal => {
    const [modalProps, setModalProps] = useState<ModalProps>({open: false});
    const [content, setContent] = useState();

    const closed = useRef<() => any | undefined>();

    const handleOpen = useCallback<HandleOpen>((content, options) => {
        closed.current = undefined;
        setContent(content);
        setModalProps({open: true, ...options});

        return {
            then: ((cb: () => any) => {
                closed.current = cb;
            })
        };
    }, []);

    const handleClose = useCallback<HandleClose>(() => {
        setModalProps({open: false});
    }, []);

    const handleClosed = useCallback(() => {
        closed.current && closed.current();
    }, []);

    return [
        <Modal key="modal" {...modalProps} onClose={handleClose} onClosed={handleClosed}>
            {content}
        </Modal>,
        handleOpen,
        handleClose
    ];
};
