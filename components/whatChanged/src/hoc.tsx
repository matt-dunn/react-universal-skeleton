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

/* eslint no-underscore-dangle: "off" */
/* eslint no-console: "off" */
import React, {ComponentType, PureComponent, ReactElement} from "react";

import { outputPathParts, deepDiff, getIdentifier, Options } from "./utils";

export default (
    options?: Options,
): <P extends {}>(WrappedComponent: ComponentType<P>) => ComponentType<P> => {
  return <P extends {}>(WrappedComponent: ComponentType<P>) =>
      class WhatChanged extends PureComponent<P> {
        componentDidUpdate = (prevProps: P, prevState: P): void => {
            outputPathParts(
                `${(WrappedComponent.displayName || WrappedComponent.name || "Unknown")}${(options && getIdentifier(options.idProp, this.props)) || ""}`,
                deepDiff(
                    {props: prevProps, state: prevState},
                    {props: this.props, state: this.state},
                    "RE-RENDER"
                )
            );
        }

        public render = (): ReactElement<any> => {
          return (
              <WrappedComponent {...this.props as P} />
          );
        }
      };
};
