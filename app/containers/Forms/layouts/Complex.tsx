import React, {useMemo} from "react";
import styled from "@emotion/styled";
import loadable from "@loadable/component";
import {defineMessages, useIntl} from "react-intl";

import {ResponsiveGrid} from "components/Grid";
import {FieldSet, FieldSetChildrenProps} from "components/Form";
import {FormOptions, FormErrors} from "components/Form";

import {withWireFrameAnnotation} from "components/Wireframe/withWireFrameAnnotation";

const Markdown = loadable(() => import("components/markdown"));

const GridItems = styled(ResponsiveGrid("div"))``;

const GridItem = styled.div`
    padding: 0 10px;
    
    &:first-of-type {
      padding-left: 0;
    }
    
    &:nth-of-type(2) {
      padding-right: 0;
    }
`;

const messages = defineMessages({
    submit: {
        // id: 'ra.action.delete',
        defaultMessage: "Submit Form",
        description: "The submit button"
    },
    reset: {
        // id: 'ra.action.show',
        defaultMessage: "Reset Form",
    },
});

const WAMarkdown = withWireFrameAnnotation(Markdown, {
    title: "Markdown",
    description: "Markdown can be used to embed content."
});

const WAMarkdownEmbedded = withWireFrameAnnotation(Markdown, {
    title: "Person Markdown",
    description: "Markdown can be embedded for each item."
});

const WAFieldSet1 = withWireFrameAnnotation(FieldSet, {
    title: "Example form items",
    description: "Various form elements..."
});

const WAFieldSet2 = withWireFrameAnnotation(FieldSet, {
    title: "SSR dropdown",
    description: "Fallback when JS is disabled."
});

const WAFieldSet3 = withWireFrameAnnotation(FieldSet, {
    title: "Notes",
    description: "Multiline notes."
});

const WAFieldSet4 = withWireFrameAnnotation(FormOptions, {
    title: "Form actions",
    description: "Reset or submit form."
});

function ComplexLayout<T, P, S>({fieldsetMap: {children, extra, otherLeft, otherRight}}: Pick<FieldSetChildrenProps<T, P, S>, "fieldsetMap">) {
    const intl = useIntl();

    const i18n = useMemo(() => ({
        submit: intl.formatMessage(messages.submit),
        reset: intl.formatMessage(messages.reset)
    }), [intl]);

    return (
        <>
            <FormErrors className="no-js"/>

            <div style={{borderBottom: "1px solid #dfdfdf", display: "flex"}}>
                <GridItems minItemWidth={150}>
                    <GridItem>
                        <WAFieldSet1
                            fields={otherLeft}
                        />
                    </GridItem>
                    <GridItem>
                        <WAMarkdown content={import("mocks/content/test2.md")} id={"md-2"}/>
                        <WAFieldSet2
                            fields={otherRight}
                        />
                        <p style={{fontSize: "0.8em", backgroundColor: "#eee", padding: "10px", borderRadius: "10px", margin: "0 0 10px 0"}}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <WAFieldSet4 i18n={i18n}/>
                    </GridItem>
                </GridItems>
            </div>
            <Markdown content={import("mocks/content/test5.md")} id={"md-5"}/>
            <GridItems minItemWidth={250}>
                <GridItem>
                    <FieldSet
                        fields={children}
                    >
                        {({fieldsetMap: {set1, set2, children}, path}) => (
                            <>
                                <WAMarkdownEmbedded content={import("mocks/content/test4.md")} id={`md-4-${path}`}/>
                                <GridItems minItemWidth={150}>
                                    <GridItem>
                                        <FieldSet
                                            fields={set1}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <FieldSet
                                            fields={set2}
                                        />
                                    </GridItem>
                                </GridItems>
                                <FieldSet
                                    fields={children}
                                />
                            </>
                        )}
                    </FieldSet>
                </GridItem>
                <GridItem>
                    <p style={{fontSize: "0.8rem", backgroundColor: "#eee", padding: "10px", borderRadius: "10px", margin: "0 0 10px 0"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <WAFieldSet3
                        fields={extra}
                    />
                </GridItem>
            </GridItems>
            <WAFieldSet4/>
        </>
    );
}

export default ComplexLayout;
