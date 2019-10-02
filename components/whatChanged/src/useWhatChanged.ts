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

import {FunctionComponent, useEffect, useRef} from 'react';

import { outputPathParts, deepDiff, getIdentifier, IOptions } from './utils';

function usePrevious(value: any) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function useWhatChanged<T>(Component: FunctionComponent<any>, value: T, options?: IOptions) {
  const prevValue = usePrevious(value);

  const diff = deepDiff(
      prevValue,
      value,
      "RE-RENDER"
  );

  outputPathParts(
      `${(Component.displayName || Component.name || 'ANONYMOUS')}${(options && getIdentifier(options.idProp, value)) || ""}`,
      diff
  );

  return diff;
}
