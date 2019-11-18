import {ReactElement, ReactNode} from "react";

declare namespace actions {
    function AboveTheFold(props: {children?: ReactNode | ReactNode[]}): ReactElement;
    function ClientOnly(props: {children?: ReactNode | ReactNode[]}): ReactElement;
    function usePerformAction (action: () => Promise<any>, test?: () => boolean): void;
}

export = actions;
