import Immutable from 'immutable';

import nextState from './immutable';

describe('Next state', () => {
    it('should update object state from payload', () => {
        const state = Immutable.fromJS({
            item: {
                id: 1,
                text: 'item 1'
            }
        })

        const actionProcessing = {
            payload: { text: 'item 1 updated'},
            meta: {
                $status: {
                    complete: false,
                    processing: true,
                    loading: false
                }
            }
        }

        expect(nextState(state, actionProcessing, {
            path: 'item'
        }).toJS()).toMatchObject({
            item: {
                text: 'item 1',
                $status: {
                    complete: false,
                    processing: true,
                    loading: false
                }
            }
        })

        const actionComplete = {
            payload: { text: 'item 1 updated'},
            meta: {
                $status: {
                    complete: true,
                    processing: false,
                    loading: false
                }
            }
        }

        expect(nextState(state, actionComplete, {
            path: 'item'
        }).toJS()).toMatchObject({
            item: {
                text: 'item 1 updated',
                $status: {
                    complete: true,
                    processing: false,
                    loading: false
                }
            }
        })


        const actionWithDefaultStatus = {
            payload: { text: 'item 1 updated'}
        }

        expect(nextState(state, actionWithDefaultStatus, {
            path: 'item'
        }).toJS()).toMatchObject({
            item: {
                text: 'item 1 updated',
                $status: {
                    complete: true,
                    processing: false,
                    loading: false
                }
            }
        })

        const actionNestedState = {
            payload: { text: 'item 1 updated'},
            meta: {
                $status: {
                    complete: false,
                    processing: true,
                    loading: false
                }
            }
        }

        expect(nextState(state, actionNestedState, {
            path: 'nested.deep.item'
        }).toJS()).toMatchObject({
            nested: {
                deep: {
                    item: {
                        $status: {
                            complete: false,
                            processing: true,
                            loading: false
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
                    processing: false,
                    loading: false
                }
            }
        }

        expect(nextState(state, actionNestedStateComplete, {
            path: 'nested.deep.item'
        }).toJS()).toMatchObject({
            nested: {
                deep: {
                    item: {
                        text: 'item 1 updated',
                        $status: {
                            complete: true,
                            processing: false,
                            loading: false
                        }
                    }
                }
            }
        })
    });

    it('should update array state from payload', () => {
        const state = Immutable.fromJS({
            items: [
                {
                    id: 1,
                    text: 'item 1'
                }
            ]
        })

        const actionProcessing = {
            payload: { text: 'item 1 updated'},
            meta: {
                id: 1,
                $status: {
                    complete: false,
                    processing: true,
                    loading: false
                }
            }
        }

        expect(nextState(state, actionProcessing, {
            path: 'items'
        }).toJS()).toMatchObject({
            $status: {
                complete: false,
                processing: true,
                loading: false
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
                    processing: false,
                    loading: false
                }
            }
        }

        expect(nextState(state, actionComplete, {
            path: 'items'
        }).toJS()).toMatchObject({
            $status: {
                complete: true,
                processing: false,
                loading: false
            },
            items: [
                {
                    text: 'item 1 updated',
                    $status: {
                        complete: true,
                        processing: false,
                        loading: false
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
                    processing: false,
                    loading: false
                }
            }
        }

        expect(nextState(state, actionCompleteNewItem, {
            path: 'items'
        }).toJS()).toMatchObject({
            $status: {
                complete: true,
                processing: false,
                loading: false
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
                    processing: false,
                    loading: false
                }
            }
        }

        expect(nextState(state, actionCompleteNewItemFirst, {
            path: 'items',
            addItem: (items, item) => items.splice(0, 0, item),
        }).toJS()).toMatchObject({
            $status: {
                complete: true,
                processing: false,
                loading: false
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
        const state = Immutable.fromJS({
            items: [
                {
                    id: 1,
                    text: 'item 1'
                }
            ]
        })

        const actionProcessingFirst = {
            payload: { text: 'item 1 updated'},
            meta: {
                id: 1,
                $status: {
                    transactionId: '1',
                    complete: false,
                    processing: true,
                    loading: false
                }
            }
        }

        const updatedState = nextState(state, actionProcessingFirst, {
            path: 'items'
        });

        expect(updatedState.toJS()).toMatchObject({
            $status: {
                complete: false,
                processing: true,
                loading: false,
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
                    processing: true,
                    loading: false
                }
            }
        }

        expect(nextState(updatedState, actionProcessingSecond, {
            path: 'items'
        }).toJS()).toMatchObject({
            $status: {
                complete: false,
                processing: true,
                loading: false,
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
