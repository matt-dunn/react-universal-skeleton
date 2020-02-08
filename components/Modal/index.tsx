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
import FocusLock from "react-focus-lock";

const modalRoot = typeof document !== "undefined" && document.body;

const ModalCloseContainer = styled.button`
  flex-grow: 0;
  cursor: pointer;
  line-height: 1;
  font-size: 1em;
  background-color: transparent;
  border: none;
  padding: 0;
  color: inherit;
`;

type ModalCloseProps = {
    onClose?: () => any;
}

const ModalClose = ({onClose}: ModalCloseProps) => <ModalCloseContainer aria-label="Close" onClick={onClose}>×</ModalCloseContainer>;

const ModalTitleContainer = styled.div`
  padding: 8px 15px;
  background-color: #999;
  border-radius: 10px 10px 0 0;
  color: #fff;
  flex-grow: 0;
  font-size: 1.25em;
  font-weight: lighter;
  display: flex;
  flex-wrap: nowrap;
`;

const ModalTitleBodyContainer = styled.div`
  flex-grow: 1;
  margin-right: 10px;
`;

type ModalTitleProps = {
    children: ReactNode;
    onClose?: () => any;
    hasClose?: boolean;
}

export const ModalTitle = ({children, onClose, hasClose = true}: ModalTitleProps) => {
    return (
        <ModalTitleContainer>
            <ModalTitleBodyContainer>
                {children}
            </ModalTitleBodyContainer>
            {hasClose && <ModalClose onClose={onClose}/>}
        </ModalTitleContainer>
    );
};

const ModalFooterContainer = styled.div`
  padding: 5px 15px;
  border-top: 1px solid #ccc;
  flex-grow: 0;
  text-align: right;
`;

type ModalFooterProps = {
    children: ReactNode;
}

export const ModalFooter = ({children}: ModalFooterProps) =>
    <ModalFooterContainer>
        {children}
    </ModalFooterContainer>;

const handleDialogClick = (e: SyntheticEvent): void => e.stopPropagation();

const ModalContainer = styled.div`
  position: fixed;
  padding: 20px;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 5050;

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
  display: flex;
  flex-direction: column;
`;

const ModalBodyContainer = styled.div`
  padding: 10px 15px;
  flex-grow: 1;
`;

type ModalComponents = {
    Title?: ReactElement;
    Footer?: ReactElement;
    rest: ReactNode[];
}

type ModalBaseProps = {
    open: boolean;
}

type ModalOptions = {
    isStatic?: boolean;
}

type ModalProps = {
    children: ReactNode | ReactNode[];
    onClose?: () => any;
    onClosed?: () => any;
} & ModalBaseProps & ModalOptions;

export const Modal = ({children, open = false, onClose, onClosed, isStatic = false}: ModalProps) => {
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

    const handleClose = () => {
        !isStatic && onClose && onClose();
    };

    return (isClient && el.current && createPortal(
        <CSSTransition
            timeout={250}
            className="fade"
            in={open}
            mountOnEnter={true}
            unmountOnExit={true}
            onExited={onClosed}
        >
            <ModalContainer onClick={handleClose}>
                <FocusLock autoFocus={false}>
                    <ModalDialog onClick={handleDialogClick}>
                        {Title && cloneElement(Title, {onClose})}
                        <ModalBodyContainer>
                            {rest}
                        </ModalBodyContainer>
                        {Footer}
                    </ModalDialog>
                </FocusLock>
            </ModalContainer>
        </CSSTransition>,
        el.current
    )) || null;
};

type PromiseLike<T = any> = {
    then: (cb: () => T) => void;
}

type UseModalProps = ModalBaseProps & ModalOptions;

type HandleOpen<T> = {
    (content: (props: T) => ReactNode | ReactText, options?: ModalOptions): PromiseLike;
}

type HandleClose = {
    (): void;
}

type UseModal<T = any> = [
    () => ReactNode,
    HandleOpen<T>,
    HandleClose
]

export function useModal<T>(props: T): UseModal<T> {
    const [modalProps, setModalProps] = useState<UseModalProps>({open: false});
    const [content, setContent] = useState();

    const closed = useRef<() => any | undefined>();

    const handleOpen = useCallback<HandleOpen<T>>((content, options) => {
        closed.current = undefined;
        setContent(() => content);
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
        () =>
            <Modal {...modalProps} onClose={handleClose} onClosed={handleClosed}>
                {content && content(props)}
            </Modal>,
        handleOpen,
        handleClose
    ];
}
