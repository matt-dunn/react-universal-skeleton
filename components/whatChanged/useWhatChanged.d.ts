import {IOptions} from "./src/utils";
import {FunctionComponent} from "react";

declare function useWhatChanged<T>(Component: FunctionComponent<any>, value: T, options?: IOptions): object;
export = useWhatChanged;

