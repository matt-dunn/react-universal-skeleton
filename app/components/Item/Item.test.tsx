import React from "react";
import { mount} from "enzyme";

import nextState from "components/state-mutate-with-status";

import {Item as Component} from "./index";

describe("Item", () => {
    it("renders correctly with no item", async () => {
        const getItem = jest.fn();

        const wrapper = mount(
            <Component
                getItem={getItem}
            />
        );

        expect(wrapper).toMatchSnapshot();

        expect(getItem).toHaveBeenCalledTimes(1);
    });

    it("renders correctly with item", async () => {
        const getItem = jest.fn();

        const item = {
            id: "item-1",
            name: "Item 1"
        };

        const wrapper = mount(
            <Component
                item={item}
                getItem={getItem}
            />
        );

        expect(wrapper).toMatchSnapshot();

        expect(getItem).not.toHaveBeenCalled();

        expect(wrapper.find("[data-value]").text()).toBe("Item 1");
    });

    it("renders correctly with processing item", async () => {
        const getItem = jest.fn();

        const item = nextState({
            id: "item-1",
            name: "Item 1"
        }, {
            type: "xx",
            meta: {
                $status: {
                    transactionId: "1",
                    processing: true,
                    complete: false
                }
            }
        });

        const wrapper = mount(
            <Component
                item={item}
                getItem={getItem}
            />
        );

        expect(wrapper).toMatchSnapshot();

        expect(getItem).not.toHaveBeenCalled();
    });
});
