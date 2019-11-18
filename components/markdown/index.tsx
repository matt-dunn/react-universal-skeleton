import React from "react";
import sanitize from "sanitize-html";

import {useAsync} from "components/ssr/safePromise";

import marked from "./marked";
import {Container} from "./style";
import {ALLOWED_CONTENT} from "./allowedContent";
import highlight from "./highlight";

type MarkdownProps = {
    content: string;
}

const Markdown = ({content}: MarkdownProps) => {
    const [parsedContent] = useAsync(marked(content, {
        gfm: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: true,
        highlightRaw: true,
        highlight
    }));

    console.log("@@@@",parsedContent && parsedContent.substring(0, 20))

    return ((parsedContent && <Container dangerouslySetInnerHTML={{__html: sanitize(parsedContent, ALLOWED_CONTENT)}}/>) || null);
};

export default Markdown
