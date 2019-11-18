import React, {useEffect, useRef, useState} from "react";
import sanitize from "sanitize-html";

import {useSafePromise} from "components/ssr/safePromise";

import marked from "./marked";
import {Container} from "./style";
import {ALLOWED_CONTENT} from "./allowedContent";
import highlight from "./highlight";

type MarkdownProps = {
    content: string;
}

const Markdown = ({content}: MarkdownProps) => {
    const [safePromise, getData] = useSafePromise<string>();
    const data = getData()
    const xx = useRef()
    const [parsedContent, setParsedContent] = useState();

    // useEffect(() => {
    if (!data) {
        safePromise(marked(content, {
                gfm: true,
                breaks: false,
                pedantic: false,
                sanitize: false,
                smartLists: true,
                smartypants: true,
                highlightRaw: true,
                highlight
            })
        )
    }

    useEffect(() => {

    }, [content, setParsedContent]);

    console.log("@@@@",data)

    if (data) {
        return (
            <Container dangerouslySetInnerHTML={{__html: sanitize(data, ALLOWED_CONTENT)}}/>
        );
    }

    return null;
};

export default Markdown
