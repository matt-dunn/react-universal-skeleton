import React, {useMemo} from "react";
import sanitize from "sanitize-html";

import {useAsync} from "components/ssr/safePromise";

import {Container} from "./style";
import {ALLOWED_CONTENT} from "./allowedContent";
import highlight from "./highlight";

type MarkdownProps = {
    content: string;
    id: string;
}

import "../highlighter/sass/_theme.scss";

const Markdown = ({content, id}: MarkdownProps) => {
    const [parsedContent] = useAsync(
        id,
        useMemo(() => () => import("./marked").then(marked => (marked.default || marked)(content, {
            gfm: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: true,
            highlightRaw: true,
            highlight
        })), [content]),
        false
    );

    return ((parsedContent && <Container dangerouslySetInnerHTML={{__html: sanitize(parsedContent, ALLOWED_CONTENT)}}/>) || null);
};

export default Markdown;
