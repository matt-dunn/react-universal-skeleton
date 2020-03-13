import React from "react";
import {mount} from "enzyme";
import { act } from "react-dom/test-utils";

import {withWireFrameAnnotation} from "./withWireFrameAnnotation";
import {WireFrameProvider} from "../context";
import {API} from "../api";

// jest.useFakeTimers();

describe("Wireframe: withWireFrameAnnotation", () => {
  let api,
    Fragment,
    WrappedComponent,
    highlightNote;

  beforeEach(() => {
    highlightNote = jest.fn();

    api = API({
      highlightNote
    });

    WrappedComponent = withWireFrameAnnotation(() => <div>MOCK COMPONENT</div>, {
      title: <div>Title</div>,
      description: <div>Description.</div>
    });

    Fragment = (
      <WireFrameProvider api={api}>
        <WrappedComponent/>
      </WireFrameProvider>
    );
  });

  it("should render without identifier when closed", () => {
    const wrapper = mount(Fragment);

    const component = api.getComponents()[0];

    expect(component).toEqual({
      id: 1,
      count: 1,
      Component: WrappedComponent.Component,
      options: {
        title: <div>Title</div>,
        description: <div>Description.</div>
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it("should render annotation identifier when open", () => {
    const wrapper = mount(Fragment);

    act(() => {
      api.setOpen(true);
    });

    expect(highlightNote).not.toHaveBeenCalled();

    expect(wrapper).toMatchSnapshot();
  });

  it("should highlight annotation", () => {
    const wrapper = mount(Fragment);

    act(() => {
      api.setOpen(true);
    });

    expect(highlightNote).not.toHaveBeenCalled();

    wrapper.simulate("mouseover");

    expect(highlightNote).toHaveBeenCalledWith(api.getComponents()[0]);

    wrapper.update();

    expect(wrapper).toMatchSnapshot();

    wrapper.simulate("mouseleave");

    expect(highlightNote).toHaveBeenCalledWith(undefined);
  });

  it("should unregister when unmounted", () => {
    const wrapper = mount(Fragment);

    expect(api.getComponents().length).toEqual(1);

    wrapper.unmount();
    expect(api.getComponents().length).toEqual(0);
  });
});
