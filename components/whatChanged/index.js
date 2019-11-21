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
    process.env.NODE_ENV === "production" && !process.env.DEBUG
        ? require("./src/hoc.prod")
        : require("./src/hoc");
