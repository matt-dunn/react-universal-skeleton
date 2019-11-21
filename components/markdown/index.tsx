import React, {useMemo} from "react";

import {useAsync} from "components/ssr/safePromise";
import SanitizeHHTML from "components/SanitizeHTML";

import highlight from "./highlight";
import {Container} from "./style";

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

    return <SanitizeHHTML html={parsedContent} as={Container}/>;
};

export default Markdown;
