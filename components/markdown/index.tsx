import React, {useMemo} from "react";
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
    const [parsedContent] = useAsync(
        id,
        useMemo(() => () => marked(content, {
            gfm: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: true,
            highlightRaw: true,
            highlight
        }), [content]),
        true
    );

    return ((parsedContent && <Container dangerouslySetInnerHTML={{__html: sanitize(parsedContent, ALLOWED_CONTENT)}}/>) || null);
};

export default Markdown
