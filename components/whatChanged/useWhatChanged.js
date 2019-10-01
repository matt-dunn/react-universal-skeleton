/** !
 *
 * All rights reserved. Copyright (c) RPI Ltd 2018
 *
 * @author Matt Dunn
 *
 */

import {IOptions} from "./src/utils";

/**
 * @module Lib
 */

// export default interface useWhatChanged<T> {}

module.exports =
    process.env.NODE_ENV === "production"
        ? require('./src/useWhatChanged.prod')
        : require('./src/useWhatChanged');
