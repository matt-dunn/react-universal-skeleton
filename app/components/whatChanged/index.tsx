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

import {
  merge, isFunction, isString, isObject, union, keys, isEmpty, get, set,
} from 'lodash';

const getObjectProp = (o: any, name: string) => {
  if (o.get && o.keySeq) {
    return o.get(name);
  }

  return o[name];
};

const getObject = (o: any) => {
  if (isFunction(o)) {
    return 'function';
  }
  return o;
};

const getType = (o: any) => {
  const parts = [];

  if (o.type && o.type.displayName) {
    parts.push(o.type && o.type.displayName);
  } else {
    if (isString(o.type)) {
      parts.push(o.type);
    }

    if (o.$$typeof.toString) {
      parts.push(o.$$typeof.toString());
    }
  }

  return parts.join('.') + (o.key ? `[${o.key}]` : '');
};

type BaseDiffObject = {
  get?: () => any;
  keySeq?: () => any;
  toJS?: () => any;
  $$typeof?: string;
  props?: any;
  state?: any;
}

export const deepDiff = (o1: BaseDiffObject, o2: BaseDiffObject, p: string, path?: string, changesInBranch: boolean = false) => {
  let changes = {};

  if (o1 !== o2) {
    if (isObject(o1) && isObject(o2)) {
      const unionKeys: string[] = union(
          o1.get && o1.keySeq ? o1.keySeq().toArray() : keys(o1),
          o2.get && o2.keySeq ? o2.keySeq().toArray() : keys(o2),
      );

      if (o1.$$typeof || o2.$$typeof) {
        changes = deepDiff(
            { props: o1.props, state: o1.state },
            { props: o2.props, state: o2.state },
            getType(o1).replace(/\./g, '__@@__'),
            (path ? `${path}.` : '') + p,
        );
      } else {
        unionKeys.forEach((key: string) => {
          const o1normalised = getObjectProp(o1, key);
          const o2normalised = getObjectProp(o2, key);
          const propertyChanges = deepDiff(o1normalised, o2normalised, key, (path ? `${path}.` : '') + p, (path && o1normalised !== o2normalised) || false);

          if (!changesInBranch && isEmpty(propertyChanges) && o1normalised !== o2normalised) {
            set(propertyChanges, `${(path ? `${path}.` : '') + p}.${key}`, {
              warning: 'AVOIDABLE',
              avoidable: true,
              __VALUE__: true,
              before: getObject(o1normalised && o1normalised.toJS ? o1normalised.toJS() : o1normalised),
              after: getObject(o2normalised && o2normalised.toJS ? o2normalised.toJS() : o2normalised),
            });
          }

          changes = merge({}, changes, propertyChanges);
        });
      }
    } else {
      set(changes, `${path}.${p}`, {
        __VALUE__: true,
        before: getObject(o1 && o1.toJS ? o1.toJS() : o1),
        after: getObject(o2 && o2.toJS ? o2.toJS() : o2),
      });
    }
  }

  return changes;
};

const countAvoidable = (o: any) => {
  if (!o.__VALUE__) {
    return keys(o).reduce((acc, key) => {
      if (isObject(o[key]) && !o[key].__VALUE__) {
        const counts = countAvoidable(o[key]);

        if (counts) {
          acc.valueCount += counts.valueCount;
          acc.avoidableCount += counts.avoidableCount;
        }
      } else if (o[key] && o[key].__VALUE__) {
        acc.valueCount += 1;

        if (o[key].avoidable) {
          acc.avoidableCount += 1;
        }
      }

      return acc;
    }, {
      valueCount: 0,
      avoidableCount: 0,
    });
  }

  return 0;
};

export const outputPathParts = (o: any, parent?: any) => {
  keys(o).sort().forEach(key => {
    let groupStyle = (parent && 'background-color:#999;color:#000;border-radius:1em;padding:2px 5px;') || 'background-color:#ccc;color:#000;border-radius:1em;padding:2px 5px;';
    let groupTitleSubText = '';

    if (o[key]) {
      const counts = countAvoidable(o[key]);

      if (counts) {
        if (counts.valueCount === counts.avoidableCount) {
          groupStyle = 'background-color:orange;color:white;border-radius:1em;padding:2px 5px;';
          groupTitleSubText = ' (ALL POTENTIALLY AVOIDABLE)';
        } else if (counts.avoidableCount > 0) {
          groupStyle = 'background-color:yellow;color:black;border-radius:1em;padding:2px 5px;';
          groupTitleSubText = ' (SOME POTENTIALLY AVOIDABLE)';
        }
      }

      if (parent) {
        console.group(`%c${key.replace(/__@@__/g, '.')}${groupTitleSubText}`, groupStyle);
      } else {
        console.groupCollapsed(`%c${key.replace(/__@@__/g, '.')}${groupTitleSubText}`, groupStyle);
      }

      if (isObject(o[key]) && !o[key].__VALUE__) {
        outputPathParts(o[key], o);
      } else if (o[key].warning) {
        console.warn(o[key].warning);
        console.warn('%cbefore', 'font-weight: bold;', o[key].before);
        console.warn('%cafter', 'font-weight: bold;', o[key].after);
      } else {
        console.log('%cbefore', 'font-weight: bold;', o[key].before);
        console.log('%cafter', 'font-weight: bold;', o[key].after);
      }

      console.groupEnd();
    }
  });
};

export const getIdentifier = (idProp: any, props: any) => (idProp && ` - (${isFunction(idProp) ? idProp(props) : get(props, idProp)})`) || '';

export interface IOptions {
  idProp: Function | string;
}

export default (
    options: IOptions = {} as IOptions,
): <P extends {}>(WrappedComponent: ComponentType<P>) => ComponentType<P> => {
  return <P extends {}>(WrappedComponent: ComponentType<P>) =>
      class WhatChanged extends PureComponent<P> {
        componentDidUpdate = (prevProps: P, prevState: P): void => {
          outputPathParts(deepDiff(
              { props: prevProps, state: prevState },
              { props: this.props, state: this.state },
              `RE-RENDER: ${(WrappedComponent.name || 'ANONYMOUS').replace(/\./g, '__@@__')}${getIdentifier(options.idProp, this.props)}`,
          ));
        }

        public render(): JSX.Element {
          return (
              <WrappedComponent {...this.props as P} />
          );
        }
      };
};
