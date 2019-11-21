/** !
 *
 * All rights reserved. Copyright (c) RPI Ltd 2018
 *
 * @author Matt Dunn
 *
 */

/**
 * @module Lib
 */

import {FunctionComponent, useEffect, useRef} from "react";
import {isEmpty} from "lodash";

import { outputPathParts, deepDiff, getIdentifier, Options } from "./utils";

function usePrevious(value: any) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function useWhatChanged<T>(Component: FunctionComponent<any>, value: T, options?: Options) {
  const prevValue = usePrevious(value);
  const hasRendered = useRef(false);

  useEffect(() => {
    hasRendered.current = true;
  }, []);

  const diff = deepDiff(
      prevValue,
      value,
      "RE-RENDER"
  );

  const id = `${(Component.displayName || Component.name || "Unknown")}${(options && getIdentifier(options.idProp, value)) || ""}`;

  if (hasRendered.current && isEmpty(diff)) {
    console.groupCollapsed(`%cRE-RENDER: ${id} - Unknown render`, "background-color:red;color:white;border-radius:1em;padding:2px 5px;");
    console.log("Check:");
    console.log("%c• You have included all state and props in this debug hook", "margin-left: 15px");
    console.log("%c• You are using a PureComponent (class) or React.memo (functional) component", "margin-left: 15px");
    console.log("%c• Component context(s) in the hierarchy whose value unexpectedly changes", "margin-left: 15px");
    console.groupEnd();
  } else {
    outputPathParts(
        id,
        diff
    );
  }

  return diff;
}
