import {createContext} from "react";

import {API, WireFrameAnnotationAPI} from "./api";

const api = API();

export const WireFrameAnnotationContext = createContext<WireFrameAnnotationAPI>(api);

