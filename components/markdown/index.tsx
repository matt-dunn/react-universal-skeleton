import React, {useMemo} from "react";

import {useAsync} from "components/ssr/safePromise";
import SanitizeHTML from "components/SanitizeHTML";
import Loading from "components/Loading";

import highlight from "./highlight";
import {Container} from "./style";

type MarkdownProps = {
    content: string | Promise<string>;
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

    if (parsedContent === undefined) {
        return <Loading height={25}/>;
    } else {
        return <SanitizeHTML html={parsedContent} as={Container}/>;
    }
};

export default Markdown;
