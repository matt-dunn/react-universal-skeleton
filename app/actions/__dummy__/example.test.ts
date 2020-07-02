import {isFunction} from "lodash";
import {Severity} from "components/notification";

import {ExampleApi, ExampleItem} from "../../components/api";

import { exampleGetItem, exampleGetList, exampleEditItem } from "./example";
import {payloadCreator} from "../../../components/redux/middleware/payloadCreator";

describe("Example actions", () => {
    let mockAPI: ReturnType<ExampleApi>;

    beforeEach(() => {
        mockAPI = {
            exampleGetList: jest.fn().mockImplementation((page?: number, count?: number) => () => `items - page=${page}, count=${count}`),
            exampleGetItem: jest.fn().mockImplementation(() => () => "item"),
            exampleEditItem: jest.fn().mockImplementation((item: ExampleItem) => () => `item - id=${item.id}, name=${item.name}`)
        };
    });

    describe("exampleGetItem", () => {
        it("should return FSA with payload creator", () => {
            const action = exampleGetItem();

            expect(typeof action.type).toBe("string");
            expect(typeof action.payload).toBe("function");

            expect(action.meta).toHaveProperty("notification");
            expect(typeof action.meta.notification).toBe("function");

            expect(isFunction(action.meta.notification) && action.meta.notification({id: "x", name: "x"}, undefined, {})).toMatchObject({
                message: expect.anything(),
                reference: "x"
            });

            // expect(payloadCreator(action.payload)()({
            //     API: {ExampleApi: mockAPI}
            // })).toBe("item");
        });
    });

    describe("exampleGetList", () => {
        it("should return FSA with payload creator", () => {
            const action = exampleGetList(4, 34);

            expect(typeof action.type).toBe("string");
            expect(typeof action.payload).toBe("function");

            // expect(payloadCreator(action.payload)()({
            //     API: {ExampleApi: mockAPI}
            // })).toBe("items - page=4, count=34");
        });
    });

    describe("exampleEditItem", () => {
        it("should return FSA with payload creator", () => {
            const action = exampleEditItem({id: "1", name: "Item 1"});

            expect(typeof action.type).toBe("string");
            expect(typeof action.payload).toBe("function");

            expect(action.meta).toHaveProperty("notification");
            expect(typeof action.meta.notification).toBe("function");

            expect(isFunction(action.meta.notification) && action.meta.notification({id: "x", name: "x"}, undefined, {id: "x"})).toMatchObject({
                message: "Item saved",
                reference: "x"
            });

            expect(isFunction(action.meta.notification) && action.meta.notification(undefined, undefined, {id: "x"})).toMatchObject({
                message: "Unable to save item",
                reference: "x",
                severity: Severity.error
            });

            // expect(payloadCreator(action.payload)()({
            //     API: {ExampleApi: mockAPI}
            // })).toBe("item - id=1, name=Item 1");
        });
    });
});
