import {Options} from "./src/utils";
import {ComponentType} from "react";

declare function useWhatChanged<T>(Component: ComponentType<any>, value: T, options?: Options): object;
export = useWhatChanged;

