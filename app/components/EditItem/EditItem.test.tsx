import React from "react";
import {shallow} from "enzyme";

import nextState from "components/state-mutate-with-status";

import {EditItem as Component} from "./index";

describe("EditItem", () => {
    it("renders correctly", () => {
        const item = {
            id: "item-1",
            name: "Item 1"
        };

        const wrapper = shallow(
            <Component
                item={item}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it("sets type 'primary'", () => {
        const item = {
            id: "item-1",
            name: "Item 1"
        };

        const wrapper = shallow(
            <Component
                item={item}
                type="primary"
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it("sets type 'secondary'", () => {
        const item = {
            id: "item-1",
            name: "Item 1"
        };

        const wrapper = shallow(
            <Component
                item={item}
                type="secondary"
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it("Sets processing message", () => {
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

        const wrapper = shallow(
            <Component
                item={item}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it("Sets error message", () => {
        const item = nextState({
            id: "item-1",
            name: "Item 1"
        }, {
            type: "xx",
            meta: {
                $status: {
                    transactionId: "1",
                    processing: false,
                    complete: false,
                    error: {
                        message: "Mock error"
                    }
                }
            }
        });

        const wrapper = shallow(
            <Component
                item={item}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
