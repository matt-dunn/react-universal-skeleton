import React, {ReactElement} from 'react'
import stream from 'stream';

import {ServerStylesheet, StyleContext} from "./stylesheet";

export default () => {
    const stylesheet = ServerStylesheet();

    const collectStyles = (tree: ReactElement): ReactElement => React.createElement(
        StyleContext.Provider,
        {value: stylesheet},
        tree
    );

    const getStyles = () =>
        (stylesheet.sheet.rules.length > 0 && `<style data-my-styled="${stylesheet.hashes.join(" ")}" data-ssr="true">${stylesheet.sheet.rules.map(rule => rule.cssText).join("")}</style>`) || "";

    const transformer = new stream.Transform({
        transform: function(chunk, encoding, callback) {
            this.push(getStyles() + chunk.toString());

            stylesheet.sheet.rules = [];

            callback();
        }
    });

    const interleaveWithNodeStream = (readableStream: NodeJS.ReadableStream): NodeJS.ReadableStream => {
        // readableStream.on('end', () => {
        //     console.error("END!!!!")
        // });

        readableStream.on('error', err => {
            // forward the error to the transform stream
            transformer.emit('error', err);
        });

        return readableStream.pipe(transformer);
    };

    return {
        collectStyles,
        rules: stylesheet.sheet.rules,
        getStyles,
        interleaveWithNodeStream
    };
}
