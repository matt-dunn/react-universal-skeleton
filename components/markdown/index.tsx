import React from "react";
import sanitize from "sanitize-html";

import {useAsync} from "components/ssr/safePromise";

import marked from "./marked";
import {Container} from "./style";
import {ALLOWED_CONTENT} from "./allowedContent";
import highlight from "./highlight";

type MarkdownProps = {
    content: string;
    id: string;
}

const Markdown = ({content, id}: MarkdownProps) => {
    const [parsedContent] = useAsync(id,() => {
        console.log("############MARKED")
        return marked(content, {
            gfm: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: true,
            highlightRaw: (process as any).browser,
            highlight
        })
    }, true);

    console.log("@@@@",parsedContent && parsedContent.substring(0, 20))

    return ((parsedContent && <Container dangerouslySetInnerHTML={{__html: sanitize(parsedContent, ALLOWED_CONTENT)}}/>) || null);
};

export default Markdown
