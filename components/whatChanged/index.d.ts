import {Options} from "./src/utils";
import {ComponentType} from "react";

declare function whatChanged (options: Options): <P extends {}>(WrappedComponent: ComponentType<P>) => ComponentType<P>
