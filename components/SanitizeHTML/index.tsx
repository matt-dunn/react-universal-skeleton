import React from "react";
import sanitize, {IOptions} from "sanitize-html";
import styled from "@emotion/styled";

import {DEFAULT_ALLOWED_CONTENT} from "./allowedContent";

const Container = styled.div<{as?: keyof JSX.IntrinsicElements | React.ComponentType<any>}>``;

type SanitiseHTMLProps = {
    html?: string;
    options?: IOptions;
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
}

const SanitizeHHTML = ({html, as, options = DEFAULT_ALLOWED_CONTENT}: SanitiseHTMLProps) => {
    return (html && <Container as={as} dangerouslySetInnerHTML={{__html: sanitize(html, options)}}/>) || null;
};

export default SanitizeHHTML;

