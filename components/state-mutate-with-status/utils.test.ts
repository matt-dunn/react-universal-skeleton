import { decorateStatus } from './utils';
import Status, {IStatusTransaction, IStatus, symbolActiveTransactions, IActiveTransactions} from './status';

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
            "outstandingTransactionCount": 0,
            "processing": false,
            [symbolActiveTransactions]: {},
            "lastUpdated": undefined,
            "processedOnServer": false
        })

        expect(decoratedStatus).toStrictEqual(currentStatus);

        const decoratedStatusWithCurrentStatus = decorateStatus(status, currentStatus)

        expect(decoratedStatusWithCurrentStatus).toEqual({
            "complete": false,
            "error": undefined,
            "hasError": false,
            "isActive": false,
            "outstandingTransactionCount": 0,
            "processing": false,
            [symbolActiveTransactions]: {},
            "lastUpdated": undefined,
            "processedOnServer": false
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
            "outstandingTransactionCount": 1,
            "processing": true,
            [symbolActiveTransactions]: {
                '1': true
            },
            "lastUpdated": undefined,
            "processedOnServer": false
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
            "outstandingTransactionCount": 4,
            "processing": true,
            [symbolActiveTransactions]: {
                '1': true,
                '2': true,
                '3': true,
                '4': true
            },
            "lastUpdated": undefined,
            "processedOnServer": false
        })
    });
});
