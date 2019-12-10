import React from "react";
import styled from "@emotion/styled";
import loadable from "@loadable/component";
import {defineMessages, useIntl} from "react-intl";

import {ResponsiveGrid} from "components/Grid";
import {FieldSet, FieldSetChildrenProps} from "components/Form";
import {FormOptions} from "components/Form/FormOptions";

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
    },
    reset: {
        // id: 'ra.action.show',
        defaultMessage: "Reset Form",
    },
});

function ComplexLayout<T, P, S>({fieldsetMap: {children, extra, otherLeft, otherRight}}: Pick<FieldSetChildrenProps<T, P, S>, "fieldsetMap">) {
    const intl = useIntl();

    const i18n = {
        submit: intl.formatMessage(messages.submit),
        reset: intl.formatMessage(messages.reset)
    };

    return (
        <>
            <div style={{borderBottom: "1px solid #dfdfdf", margin: "0 0 20px 0", padding: "0 0 10px 0", display: "flex"}}>
                <GridItems minItemWidth={150}>
                    <GridItem>
                        <FieldSet
                            fields={otherLeft}
                        />
                    </GridItem>
                    <GridItem>
                        <Markdown content={import("mocks/content/test2.md")} id={"md-2"}/>
                        <FieldSet
                            fields={otherRight}
                        />
                        <p style={{fontSize: "14px", backgroundColor: "#eee", padding: "10px", borderRadius: "10px", margin: "0 0 10px 0"}}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <FormOptions i18n={i18n}/>
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
                                <Markdown content={import("mocks/content/test4.md")} id={`md-4-${path}`}/>
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
                    <p style={{fontSize: "14px", backgroundColor: "#eee", padding: "10px", borderRadius: "10px", margin: "0 0 10px 0"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <FieldSet
                        fields={extra}
                    />
                </GridItem>
            </GridItems>
            <FormOptions/>
        </>
    );
}

export default ComplexLayout;
