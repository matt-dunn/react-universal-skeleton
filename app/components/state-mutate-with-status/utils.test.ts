import Immutable from 'immutable';

import { parsePath, makePath, findIndex, getUpdatePath, decorateStatus } from './utils';
import Status, {IStatusTransaction, IStatus, symbolActiveTransactions, IActiveTransactions} from './status';

describe('parsePath', () => {
    it('should convert dot.notation string to string array', () => {
        expect(parsePath('')).toEqual([]);

        expect(parsePath('path')).toEqual(['path']);

        expect(parsePath('path.parts')).toEqual(['path', 'parts']);

        expect(parsePath('path.parts.part')).toEqual(['path', 'parts', 'part']);
    });
});

describe('makePath', () => {
    it('should convert string array to dot.notation string', () => {
        expect(makePath([''])).toEqual('');

        expect(makePath(['path'])).toEqual('path');

        expect(makePath(['path', 'parts'])).toEqual('path.parts');

        expect(makePath(['path', 'parts', 'part'])).toEqual('path.parts.part');
    });

    it('should convert string and number array to dot.notation string', () => {
        expect(makePath([''])).toEqual('');

        expect(makePath(['path', 1])).toEqual('path.1');

        expect(makePath(['path', 'parts', 2])).toEqual('path.parts.2');

        expect(makePath(['path', 'parts', 'part', 3])).toEqual('path.parts.part.3');
    });
});

describe('findIndex', () => {
    describe('With native object', () => {
        const items = [
            {
                id: '1'
            },
            {
                id: '2'
            }
        ];

        it('should return correct index', () => {
            expect(findIndex(items, '1')).toEqual(0);

            expect(findIndex(items, '2')).toEqual(1);
        });

        it('should return -1 if not found', () => {
            expect(findIndex([], '1')).toEqual(-1);

            expect(findIndex(items, '3')).toEqual(-1);

            expect(findIndex(items, '')).toEqual(-1);
        });
    });

    describe('With immutable.js object', () => {
        const items = Immutable.fromJS([
            {
                id: '1'
            },
            {
                id: '2'
            }
        ]);

        it('should return correct index', () => {
            expect(findIndex(items, '1')).toEqual(0);

            expect(findIndex(items, '2')).toEqual(1);
        });

        it('should return -1 if not found', () => {
            expect(findIndex([], '1')).toEqual(-1);

            expect(findIndex(items, '3')).toEqual(-1);

            expect(findIndex(items, '')).toEqual(-1);
        });
    });
});

describe('getUpdatePath', () => {
    const isArray = (obj: any) => Array.isArray(obj);

    describe('With object', () => {
        const o = {
            path: {
                item: {}
            }
        };

        it('should return correct path', () => {
            expect(getUpdatePath(isArray, o, '','path.item')).toEqual('path.item')
        });
    });

    describe('With array', () => {
        const o = [
            {
                id: '1'
            },
            {
                id: '2'
            }
        ];

        it('should return correct path with found index', () => {
            expect(getUpdatePath(isArray, o, '1','path.item')).toEqual('path.item.0')

            expect(getUpdatePath(isArray, o, '2','path.item')).toEqual('path.item.1')
        });

        it('should return correct path with not found index', () => {
            expect(getUpdatePath(isArray, o, '','path.item')).toEqual('path')

            expect(getUpdatePath(isArray, o, '','path.to.item')).toEqual('path.to')
        });
    });
});

describe('decorateStatus', () => {
    it('should return default status', () => {
        const status: IStatusTransaction = {} as IStatusTransaction;
        const currentStatus = Status({} as IStatus);

        const decoratedStatus = decorateStatus(status);

        expect(decoratedStatus).toEqual({
            "complete": false,
            "error": undefined,
            "hasError": false,
            "isActive": false,
            "loading": false,
            "outstandingTransactionCount": 0,
            "processing": false,
            [symbolActiveTransactions]: {}
        })

        expect(decoratedStatus).toStrictEqual(currentStatus);

        const decoratedStatusWithCurrentStatus = decorateStatus(status, currentStatus)

        expect(decoratedStatusWithCurrentStatus).toEqual({
            "complete": false,
            "error": undefined,
            "hasError": false,
            "isActive": false,
            "loading": false,
            "outstandingTransactionCount": 0,
            "processing": false,
            [symbolActiveTransactions]: {}
        })

        expect(decoratedStatusWithCurrentStatus).toStrictEqual(currentStatus);
    });

    it('should mutate status', () => {
        const status: IStatusTransaction = {
            transactionId: '4',
            processing: true
        } as IStatusTransaction;
        const currentStatus = Status({
            processing: true,
            [symbolActiveTransactions]: {
                '1': true,
                '2': true,
                '3': true
            } as IActiveTransactions
        } as IStatus);

        expect(decorateStatus(status, currentStatus)).not.toStrictEqual(currentStatus);
    });

    it('should not mutate status', () => {
        const status: IStatusTransaction = {
            transactionId: '4',
            processing: true
        } as IStatusTransaction;
        const currentStatus = Status({
            processing: true,
            [symbolActiveTransactions]: {
                '1': true,
                '2': true,
                '3': true,
                '4': true
            } as IActiveTransactions
        } as IStatus);

        expect(decorateStatus(status, currentStatus)).toStrictEqual(currentStatus);
    });

    it('should return correct transaction state when processing', () => {
        const status: IStatusTransaction = {
            transactionId: '1',
            processing: true
        } as IStatusTransaction;
        const currentStatus = Status({} as IStatus);

        expect(decorateStatus(status, currentStatus)).toEqual({
            "complete": false,
            "error": undefined,
            "hasError": false,
            "isActive": false,
            "loading": false,
            "outstandingTransactionCount": 1,
            "processing": true,
            [symbolActiveTransactions]: {
                '1': true
            }
        })
    });

    it('should return correct transactions state when processing', () => {
        const status: IStatusTransaction = {
            transactionId: '4',
            processing: true
        } as IStatusTransaction;
        const currentStatus = Status({
            [symbolActiveTransactions]: {
                '1': true,
                '2': true,
                '3': true
            } as IActiveTransactions
        } as IStatus);

        expect(decorateStatus(status, currentStatus)).toEqual({
            "complete": false,
            "error": undefined,
            "hasError": false,
            "isActive": false,
            "loading": false,
            "outstandingTransactionCount": 4,
            "processing": true,
            [symbolActiveTransactions]: {
                '1': true,
                '2': true,
                '3': true,
                '4': true
            }
        })
    });
});
