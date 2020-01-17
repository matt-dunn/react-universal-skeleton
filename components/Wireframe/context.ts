import {createContext} from "react";

import {API, WireFrameAnnotationAPI} from "./api";

export const WireFrameAnnotationContext = createContext<WireFrameAnnotationAPI>(API());

