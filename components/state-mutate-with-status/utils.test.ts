import { decorateStatus } from "./utils";
import {Status, MetaStatus, symbolActiveTransactions} from "./status";

describe("decorateStatus", () => {
    it("should return default status", () => {
        const status: MetaStatus = {} as MetaStatus;
        const currentStatus = Status();

        const decoratedStatus = decorateStatus(status);

        expect(decoratedStatus).toEqual({
            "cancelled": false,
            "complete": true,
            "error": undefined,
            "hasError": false,
            "outstandingTransactionCount": 0,
            "outstandingCurrentTransactionCount": 0,
            "processing": false,
            "updatingChildren": false,
            [symbolActiveTransactions]: {},
            "lastUpdated": undefined,
            "processedOnServer": true
        });

        const decoratedStatusWithCurrentStatus = decorateStatus(status, currentStatus);

        expect(decoratedStatusWithCurrentStatus).toEqual({
            "cancelled": false,
            "complete": true,
            "error": undefined,
            "hasError": false,
            "outstandingTransactionCount": 0,
            "outstandingCurrentTransactionCount": 0,
            "updatingChildren": false,
            "processing": false,
            [symbolActiveTransactions]: {},
            "lastUpdated": undefined,
            "processedOnServer": true
        });
    });

    it("should mutate status", () => {
        const status: MetaStatus = {
            transactionId: "4",
            processing: true
        } as MetaStatus;
        const currentStatus = Status({
            [symbolActiveTransactions]: {
                "1": true,
                "2": true,
                "3": true
            }
        });

        expect(decorateStatus(status, currentStatus)).not.toStrictEqual(currentStatus);
    });

    it("should not mutate status", () => {
        const status: MetaStatus = {
            transactionId: "4",
            processing: true
        } as MetaStatus;
        const currentStatus = Status({
            [symbolActiveTransactions]: {
                "1": true,
                "2": true,
                "3": true,
                "4": true
            },
            complete: false
        });

        expect(decorateStatus(status, currentStatus)).toStrictEqual(currentStatus);
    });

    it("should return correct transaction state when processing", () => {
        const status: MetaStatus = {
            transactionId: "1",
            processing: true
        } as MetaStatus;
        const currentStatus = Status();

        expect(decorateStatus(status, currentStatus)).toEqual({
            "cancelled": false,
            "complete": false,
            "error": undefined,
            "hasError": false,
            "outstandingTransactionCount": 1,
            "outstandingCurrentTransactionCount": 1,
            "updatingChildren": false,
            "processing": true,
            [symbolActiveTransactions]: {
                "1": true
            },
            "lastUpdated": undefined,
            "processedOnServer": true
        });
    });

    it("should return correct transactions state when processing", () => {
        const status: MetaStatus = {
            transactionId: "4",
            processing: true
        } as MetaStatus;
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
            "outstandingTransactionCount": 4,
            "outstandingCurrentTransactionCount": 4,
            "updatingChildren": false,
            "processing": true,
            [symbolActiveTransactions]: {
                "1": true,
                "2": true,
                "3": true,
                "4": true
            },
            "lastUpdated": undefined,
            "processedOnServer": true
        });
    });
});
