import React, { Component, ElementType } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { History, Location, UnregisterCallback } from "history";

import { ErrorLike, ErrorMeta, HandleError, isErrorMeta, Update, ActionError } from "./types";
import { ErrorContext, ErrorHandlerContext } from "./contexts";

type ErrorComponentProps = {
  error: ErrorLike;
}

type ErrorBoundaryProps = {
  ErrorComponent: ElementType<ErrorComponentProps>;
  handler?: HandleError;
} & RouteComponentProps

type ErrorBoundaryState = {
  error?: ErrorLike;
  key: number;
  componentMeta: ErrorMeta | undefined | true;
}

const callHandler = (ex: ErrorLike, handler: HandleError, location: Location, history: History, props: any, update?: Update) => {
  const { pathname, search, hash } = (typeof window !== "undefined" && window.location) || location;

  return handler(
    ex,
    `${pathname}${(search && `?${encodeURIComponent(search.substr(1))}`) || ""}${(hash && `#${encodeURIComponent(hash.substr(1))}`) || ""}`,
    history,
    props,
    update
  );
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static contextType = ErrorContext;

  unlisten: UnregisterCallback;
  blocking: boolean;
  api: ErrorHandlerContext;

  constructor (props: ErrorBoundaryProps, context: ErrorHandlerContext) {
    super(props, context);

    this.blocking = false;

    this.unlisten = props.history.listen(() => {
      this.blocking = false;

      this.setState({
        error: undefined,
        componentMeta: undefined
      });
    });

    if (this.props.handler) {
      window.addEventListener("actionError", this.handleErrorEvent as EventListener);
    }

    this.api = {
      handleError: this.handleError
    };

    const errorContext = this.context;

    const { handler, location, history } = this.props;

    this.state = {
      error: undefined,
      key: 0,
      componentMeta: (errorContext && errorContext.error && handler) && callHandler(errorContext.error, handler, location, history, this.props)
    };
  }

  static getDerivedStateFromError (error: ErrorLike) {
    return { error: error };
  }

  // componentDidCatch (error: ErrorLike, errorInfo: any) {
  //   console.error(errorInfo);
  // }

  componentWillUnmount () {
    this.unlisten();
    window.removeEventListener("actionError", this.handleErrorEvent as EventListener);
  }

  handleError = (ex: ErrorLike) => {
    if (!this.blocking && this.props.handler) {
      this.blocking = true;

      const { handler, location, history } = this.props;

      const ret = callHandler(ex, handler, location, history, this.props, () => {
        this.blocking = false;

        this.setState({
          componentMeta: undefined,
          key: this.state.key + 1
        });
      });

      this.setState({
        componentMeta: ret,
      });

      return ret !== undefined;
    }

    return true;
  }

  handleErrorEvent = (e: CustomEvent<ActionError>)=> {
    if (e.detail.error && this.handleError(e.detail.error)) {
      e.preventDefault();
    }
  }

  render () {
    const { error, componentMeta, key } = this.state;
    const { children, ErrorComponent } = this.props;

    const renderChildren = isErrorMeta(componentMeta) ? (!componentMeta?.component || componentMeta.includeChildren) : true;

    return (
      <ErrorHandlerContext.Provider value={this.api} key={key}>
        {isErrorMeta(componentMeta) && componentMeta?.component}
        {renderChildren && ((error && <ErrorComponent error={error}/>) || children)}
      </ErrorHandlerContext.Provider>
    );
  }
}

const withRouterErrorBoundary = withRouter(React.memo(ErrorBoundary));

export { withRouterErrorBoundary as ErrorBoundary };
