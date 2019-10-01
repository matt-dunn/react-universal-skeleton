import {IOptions} from "./src/utils";
import {ComponentType} from "react";

declare function whatChanged (options: IOptions): <P extends {}>(WrappedComponent: ComponentType<P>) => ComponentType<P>
