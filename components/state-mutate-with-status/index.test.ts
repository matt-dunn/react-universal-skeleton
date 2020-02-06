import { FluxStandardAction } from "flux-standard-action";

import nextState, {symbolStatus} from "./";

describe("next state", () => {
    describe("Object state", () => {
        let state: any;

        beforeEach(() => {
            state = {
                item: {
                    id: 1,
                    text: "item 1"
                },
                nested: {
                    deep: {
                        item: {
                            id: 1,
                            text: "item 1"
                        }
                    }
                }
            };
        });

        it("should update payload when not complete", () => {
            const actionProcessing: FluxStandardAction<string, any, any> = {
                type: "TEST",
                payload: { text: "item 1 updated"},
                meta: {
                    $status: {
                        complete: false,
                        processing: true
                    }
                }
            };

            expect(nextState(state, actionProcessing, {
                path: ["item"]
            })).toMatchObject({
                item: {
                    text: "item 1 updated",
                    [symbolStatus]: {
                        complete: false,
                        processing: true
                    }
                }
            });
        });

        it("should update payload when complete", () => {
            const actionComplete: FluxStandardAction<string, any, any> = {
                type: "TEST",
                payload: { text: "item 1 updated"},
                meta: {
                    $status: {
                        complete: true,
                        processing: false
                    }
                }
            };

            expect(nextState(state, actionComplete, {
                path: ["item"]
            })).toMatchObject({
                item: {
                    text: "item 1 updated",
                    [symbolStatus]: {
                        complete: true,
                        processing: false
                    }
                }
            });
        });

        it("should update payload when using default status", () => {
            const actionWithDefaultStatus: FluxStandardAction<string, any, any> = {
                type: "TEST",
                payload: { text: "item 1 updated"}
            };

            expect(nextState(state, actionWithDefaultStatus, {
                path: ["item"]
            })).toMatchObject({
                item: {
                    text: "item 1 updated"
                }
            });
        });

        it("should update nested payload when not complete", () => {
            const actionNestedState: FluxStandardAction<string, any, any> = {
                type: "TEST",
                payload: { text: "item 1 updated"},
                meta: {
                    $status: {
                        complete: false,
                        processing: true
                    }
                }
            };

            expect(nextState(state, actionNestedState, {
                path: ["nested", "deep", "item"]
            })).toMatchObject({
                nested: {
                    deep: {
                        item: {
                            text: "item 1 updated",
                            [symbolStatus]: {
                                complete: false,
                                processing: true,
                            }
                        }
                    }
                }
            });
        });

        it("should update nested payload when complete", () => {
            const actionNestedStateComplete: FluxStandardAction<string, any, any> = {
                type: "TEST",
                payload: { text: "item 1 updated"},
                meta: {
                    $status: {
                        complete: true,
                        processing: false
                    }
                }
            };

            expect(nextState(state, actionNestedStateComplete, {
                path: ["nested", "deep", "item"]
            })).toMatchObject({
                nested: {
                    deep: {
                        item: {
                            text: "item 1 updated",
                            [symbolStatus]: {
                                complete: true,
                                processing: false
                            }
                        }
                    }
                }
            });
        });
    });

    describe("Array state", () => {
        let state: any;

        beforeEach(() => {
            state = {
                items: [
                    {
                        id: 1,
                        text: "item 1"
                    }
                ]
            };
        });

        it("should update payload when not complete", () => {
            const actionProcessing: FluxStandardAction<string, any, any> = {
                type: "TEST",
                payload: { text: "item 1 updated"},
                meta: {
                    id: 1,
                    $status: {
                        complete: false,
                        processing: true
                    }
                }
            };

            expect([...nextState(state, actionProcessing, {
                path: ["items"]
            }).items]).toMatchObject([
                {
                    text: "item 1 updated",
                }
            ]);
        });

        it("should update payload when complete", () => {
            const actionComplete: FluxStandardAction<string, any, any> = {
                type: "TEST",
                payload: { text: "item 1 updated"},
                meta: {
                    id: 1,
                    $status: {
                        complete: true,
                        processing: false
                    }
                }
            };

            expect([...nextState(state, actionComplete, {
                path: ["items"]
            }).items]).toMatchObject([
                {
                    text: "item 1 updated",
                    [symbolStatus]: {
                        complete: true,
                        processing: false
                    }
                }
            ]);
        });

        it("should add a new item to the end of the array by default when complete ", () => {
            const actionCompleteNewItem: FluxStandardAction<string, any, any> = {
                type: "TEST",
                payload: { text: "item 2"},
                meta: {
                    id: 2,
                    $status: {
                        complete: true,
                        processing: false
                    }
                }
            };

            expect([...nextState(state, actionCompleteNewItem, {
                path: ["items"],
                autoDelete: true,
                autoInsert: true
            }).items]).toMatchObject([
                {
                    text: "item 1"
                },
                {
                    text: "item 2"
                }
            ]);
        });

        it("should add a new item to the specified index in the array when complete ", () => {
            const actionCompleteNewItemFirst: FluxStandardAction<string, any, any> = {
                type: "TEST",
                payload: { text: "item 2 updated"},
                meta: {
                    id: 2,
                    $status: {
                        complete: true,
                        processing: false
                    }
                }
            };

            expect([...nextState(state, actionCompleteNewItemFirst, {
                path: ["items"],
                autoDelete: true,
                autoInsert: true,
                getNewItemIndex: (/*items, item*/) => 0,
            }).items]).toMatchObject([
                {
                    text: "item 2 updated"
                },
                {
                    text: "item 1"
                }
            ]);
        });
    });

    describe("Multiple transactions", () => {
        it("should handle multiple transactions", () => {
            const state = {
                items: [
                    {
                        id: 1,
                        text: "item 1"
                    }
                ]
            };

            const actionProcessingFirst: FluxStandardAction<string, any, any> = {
                type: "TEST",
                payload: { text: "item 1 updated"},
                meta: {
                    id: 1,
                    $status: {
                        transactionId: "1",
                        complete: false,
                        processing: true
                    }
                }
            };

            const updatedState = nextState(state, actionProcessingFirst, {
                path: ["items"]
            });

            expect([...updatedState.items]).toMatchObject([
                {
                    text: "item 1 updated",
                }
            ]);

            const actionProcessingSecond: FluxStandardAction<string, any, any> = {
                type: "TEST",
                payload: { text: "item 1 updated"},
                meta: {
                    id: 1,
                    $status: {
                        transactionId: "2",
                        complete: false,
                        processing: true
                    }
                }
            };

            expect([...nextState(updatedState, actionProcessingSecond, {
                path: ["items"]
            }).items]).toMatchObject([
                {
                    text: "item 1 updated",
                }
            ]);
        });
    });
});
