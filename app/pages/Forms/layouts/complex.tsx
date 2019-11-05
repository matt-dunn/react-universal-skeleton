import React from "react";
import styled from "styled-components";

import {ResponsiveGrid} from "components/Grid";
import FieldSet from "components/Form/FieldSet";
import {FieldSetMap} from "components/Form/types";

const GridItems = styled(ResponsiveGrid("div"))``;

const GridItem = styled.div`
    padding: 0 10px 0 0;
`;

function layout<T>({children, extra, other}: FieldSetMap<T>) {
    return (
        <>
            <div style={{borderBottom: "1px solid #dfdfdf", margin: "0 0 20px 0", padding: "0 0 10px 0"}}>
                <FieldSet
                    fields={other}
                />
                <p style={{fontSize: "14px", backgroundColor: "#eee", padding: "10px", borderRadius: "10px", margin: "0 0 10px 0"}}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </div>
            <GridItems minItemWidth={250}>
                <GridItem>
                    <FieldSet
                        fields={children}
                    >
                        {({set1, set2, children}) => {
                            return (
                                <>
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
                            )
                        }}
                    </FieldSet>
                </GridItem>
                <GridItem>
                    <p style={{fontSize: "14px", backgroundColor: "#eee", padding: "10px", borderRadius: "10px", margin: "0 0 10px 0"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <FieldSet
                        fields={extra}
                    />
                </GridItem>
            </GridItems>
        </>
    )
}

export default layout;
