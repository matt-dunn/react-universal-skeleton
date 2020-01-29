import { decorateStatus } from "./utils";
import {Status, StatusTransaction, symbolActiveTransactions} from "./status";

describe("decorateStatus", () => {
    it("should return default status", () => {
        const status: StatusTransaction = {} as StatusTransaction;
        const currentStatus = Status();

        const decoratedStatus = decorateStatus(status);

        expect(decoratedStatus).toEqual({
            "cancelled": false,
            "complete": false,
            "error": undefined,
            "hasError": false,
            "isActive": false,
            "outstandingTransactionCount": 0,
            "processing": false,
            [symbolActiveTransactions]: {},
            "lastUpdated": undefined,
            "processedOnServer": false
        });

        expect(decoratedStatus).toStrictEqual(currentStatus);

        const decoratedStatusWithCurrentStatus = decorateStatus(status, currentStatus);

        expect(decoratedStatusWithCurrentStatus).toEqual({
            "cancelled": false,
            "complete": false,
            "error": undefined,
            "hasError": false,
            "isActive": false,
            "outstandingTransactionCount": 0,
            "processing": false,
            [symbolActiveTransactions]: {},
            "lastUpdated": undefined,
            "processedOnServer": false
        });

        expect(decoratedStatusWithCurrentStatus).toStrictEqual(currentStatus);
    });

    it("should mutate status", () => {
        const status: StatusTransaction = {
            transactionId: "4",
            processing: true
        } as StatusTransaction;
        const currentStatus = Status({
            processing: true,
            [symbolActiveTransactions]: {
                "1": true,
                "2": true,
                "3": true
            }
        });

        expect(decorateStatus(status, currentStatus)).not.toStrictEqual(currentStatus);
    });

    it("should not mutate status", () => {
        const status: StatusTransaction = {
            transactionId: "4",
            processing: true
        } as StatusTransaction;
        const currentStatus = Status({
            processing: true,
            [symbolActiveTransactions]: {
                "1": true,
                "2": true,
                "3": true,
                "4": true
            }
        });

        expect(decorateStatus(status, currentStatus)).toStrictEqual(currentStatus);
    });

    it("should return correct transaction state when processing", () => {
        const status: StatusTransaction = {
            transactionId: "1",
            processing: true
        } as StatusTransaction;
        const currentStatus = Status();

        expect(decorateStatus(status, currentStatus)).toEqual({
            "cancelled": false,
            "complete": false,
            "error": undefined,
            "hasError": false,
            "isActive": false,
            "outstandingTransactionCount": 1,
            "processing": true,
            [symbolActiveTransactions]: {
                "1": true
            },
            "lastUpdated": undefined,
            "processedOnServer": false
        });
    });

    it("should return correct transactions state when processing", () => {
        const status: StatusTransaction = {
            transactionId: "4",
            processing: true
        } as StatusTransaction;
        const currentStatus = Status({
            [symbolActiveTransactions]: {
                "1": true,
                "2": true,
                "3": true
            }
        });

        expect(decorateStatus(status, currentStatus)).toEqual({
            "cancelled": false,
            "complete": false,
            "error": undefined,
            "hasError": false,
            "isActive": false,
            "outstandingTransactionCount": 4,
            "processing": true,
            [symbolActiveTransactions]: {
                "1": true,
                "2": true,
                "3": true,
                "4": true
            },
            "lastUpdated": undefined,
            "processedOnServer": false
        });
    });
});
