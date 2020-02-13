import React, {Component, ElementType} from "react";

import {ErrorLike} from "components/error";

type ErrorComponentProps = {
    error: ErrorLike;
}

type ErrorBoundaryProps = {
    ErrorComponent: ElementType<ErrorComponentProps>;
}

type ErrorBoundaryState = {
    error?: ErrorLike;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { error: undefined };
    }

    static getDerivedStateFromError(error: ErrorLike) {
        return { error: error };
    }

    componentDidCatch(error: ErrorLike, errorInfo: any) {
        console.error(errorInfo);
    }

    render() {
        const {error} = this.state;
        const {children, ErrorComponent} = this.props;

        return (error && <ErrorComponent error={error}/>) || children;
    }
}

