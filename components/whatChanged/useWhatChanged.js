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

module.exports =
    process.env.NODE_ENV === "production"
        ? require("./src/useWhatChanged.prod")
        : require("./src/useWhatChanged");
