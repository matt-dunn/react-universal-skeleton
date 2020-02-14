import React, {Component, ElementType} from "react";
import { withRouter, RouteComponentProps } from "react-router";
import {UnregisterCallback} from "history";

import {ErrorLike} from "components/error";

type ErrorComponentProps = {
    error: ErrorLike;
}

type ErrorBoundaryProps = {
    ErrorComponent: ElementType<ErrorComponentProps>;
} & RouteComponentProps

type ErrorBoundaryState = {
    error?: ErrorLike;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    unlisten: UnregisterCallback;

    constructor(props: ErrorBoundaryProps) {
        super(props);

        this.unlisten = props.history.listen(() => {
            this.setState({error: undefined});
        });

        this.state = { error: undefined };
    }

    static getDerivedStateFromError(error: ErrorLike) {
        return { error: error };
    }

    componentDidCatch(error: ErrorLike, errorInfo: any) {
        console.error(errorInfo);
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        const {error} = this.state;
        const {children, ErrorComponent} = this.props;

        return (error && <ErrorComponent error={error}/>) || children;
    }
}

export default withRouter(ErrorBoundary);
