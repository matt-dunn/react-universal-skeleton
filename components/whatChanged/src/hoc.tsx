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
import React, { ComponentType, PureComponent } from 'react';

import { outputPathParts, deepDiff, getIdentifier, IOptions } from './utils';

export default (
    options?: IOptions,
): <P extends {}>(WrappedComponent: ComponentType<P>) => ComponentType<P> => {
  return <P extends {}>(WrappedComponent: ComponentType<P>) =>
      class WhatChanged extends PureComponent<P> {
        componentDidUpdate = (prevProps: P, prevState: P): void => {
            outputPathParts(
                `${(WrappedComponent.displayName || WrappedComponent.name || 'ANONYMOUS')}${(options && getIdentifier(options.idProp, this.props)) || ""}`,
                deepDiff(
                    {props: prevProps, state: prevState},
                    {props: this.props, state: this.state},
                    "RE-RENDER"
                )
            );
        }

        public render = (): JSX.Element => {
          return (
              <WrappedComponent {...this.props as P} />
          );
        }
      };
};
