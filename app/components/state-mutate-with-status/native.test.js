import nextState from './native';

describe('Next state', () => {
    it('should update object state from payload', () => {
        const state = {
            item: {
                id: 1,
                text: 'item 1'
            }
        }

        const actionProcessing = {
            payload: { text: 'item 1 updated'},
            meta: {
                $status: {
                    complete: false,
                    processing: true
                }
            }
        }

        expect(nextState(state, actionProcessing, {
            path: 'item'
        })).toMatchObject({
            item: {
                text: 'item 1',
                $status: {
                    complete: false,
                    processing: true
                }
            }
        })

        const actionComplete = {
            payload: { text: 'item 1 updated'},
            meta: {
                $status: {
                    complete: true,
                    processing: false
                }
            }
        }

        expect(nextState(state, actionComplete, {
            path: 'item'
        })).toMatchObject({
            item: {
                text: 'item 1 updated',
                $status: {
                    complete: true,
                    processing: false
                }
            }
        })


        const actionWithDefaultStatus = {
            payload: { text: 'item 1 updated'}
        }

        expect(nextState(state, actionWithDefaultStatus, {
            path: 'item'
        })).toMatchObject({
            item: {
                text: 'item 1 updated',
                $status: {
                    complete: true,
                    processing: false
                }
            }
        })

        const actionNestedState = {
            payload: { text: 'item 1 updated'},
            meta: {
                $status: {
                    complete: false,
                    processing: true
                }
            }
        }

        expect(nextState(state, actionNestedState, {
            path: 'nested.deep.item'
        })).toMatchObject({
            nested: {
                deep: {
                    item: {
                        $status: {
                            complete: false,
                            processing: true,
                        }
                    }
                }
            }
        })

        const actionNestedStateComplete = {
            payload: { text: 'item 1 updated'},
            meta: {
                $status: {
                    complete: true,
                    processing: false
                }
            }
        }

        expect(nextState(state, actionNestedStateComplete, {
            path: 'nested.deep.item'
        })).toMatchObject({
            nested: {
                deep: {
                    item: {
                        text: 'item 1 updated',
                        $status: {
                            complete: true,
                            processing: false
                        }
                    }
                }
            }
        })
    });

    it('should update array state from payload', () => {
        const state = {
            items: [
                {
                    id: 1,
                    text: 'item 1'
                }
            ]
        }

        const actionProcessing = {
            payload: { text: 'item 1 updated'},
            meta: {
                id: 1,
                $status: {
                    complete: false,
                    processing: true
                }
            }
        }

        expect(nextState(state, actionProcessing, {
            path: 'items'
        })).toMatchObject({
            $status: {
                complete: false,
                processing: true
            },
            items: [
                {
                    text: 'item 1',
                }
            ]
        })

        const actionComplete = {
            payload: { text: 'item 1 updated'},
            meta: {
                id: 1,
                $status: {
                    complete: true,
                    processing: false
                }
            }
        }

        expect(nextState(state, actionComplete, {
            path: 'items'
        })).toMatchObject({
            $status: {
                complete: true,
                processing: false
            },
            items: [
                {
                    text: 'item 1 updated',
                    $status: {
                        complete: true,
                        processing: false
                    }
                }
            ]
        })

        const actionCompleteNewItem = {
            payload: { text: 'item 2'},
            meta: {
                id: 2,
                $status: {
                    complete: true,
                    processing: false
                }
            }
        }

        expect(nextState(state, actionCompleteNewItem, {
            path: 'items'
        })).toMatchObject({
            $status: {
                complete: true,
                processing: false
            },
            items: [
                {
                    text: 'item 1'
                },
                {
                    text: 'item 2'
                }
            ]
        })

        const actionCompleteNewItemFirst = {
            payload: { text: 'item 2'},
            meta: {
                id: 2,
                $status: {
                    complete: true,
                    processing: false
                }
            }
        }

        expect(nextState(state, actionCompleteNewItemFirst, {
            path: 'items',
            addItem: (items, item) => [item, ...items],
        })).toMatchObject({
            $status: {
                complete: true,
                processing: false
            },
            items: [
                {
                    text: 'item 2'
                },
                {
                    text: 'item 1'
                }
            ]
        })
    });

    it('should handle multiple transactions', () => {
        const state = {
            items: [
                {
                    id: 1,
                    text: 'item 1'
                }
            ]
        }

        const actionProcessingFirst = {
            payload: { text: 'item 1 updated'},
            meta: {
                id: 1,
                $status: {
                    transactionId: '1',
                    complete: false,
                    processing: true
                }
            }
        }

        const updatedState = nextState(state, actionProcessingFirst, {
            path: 'items'
        });

        expect(updatedState).toMatchObject({
            $status: {
                complete: false,
                processing: true,
                outstandingTransactionCount: 1
            },
            items: [
                {
                    text: 'item 1',
                }
            ]
        })

        const actionProcessingSecond = {
            payload: { text: 'item 1 updated'},
            meta: {
                id: 1,
                $status: {
                    transactionId: '2',
                    complete: false,
                    processing: true
                }
            }
        }

        expect(nextState(updatedState, actionProcessingSecond, {
            path: 'items'
        })).toMatchObject({
            $status: {
                complete: false,
                processing: true,
                outstandingTransactionCount: 2
            },
            items: [
                {
                    text: 'item 1',
                }
            ]
        })
    });
});
