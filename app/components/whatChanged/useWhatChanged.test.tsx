import React from 'react';
import { shallow } from "enzyme";

import useWhatChanged from "./useWhatChanged";

export type IDummyProps = { testString: string; testNumber: number; };

function Dummy({ testNumber, testString}: IDummyProps) {
    useWhatChanged(Dummy, { testNumber, testString });

    return (
        <div>DUMMY COMPONENT: [{testString}] [{testNumber}]</div>
    )
}

describe('useWhatChanged', () => {
    it('should detect changed properties', () => {
        const spyConsoleGroupCollapsed = jest.spyOn(global.console, 'groupCollapsed').mockImplementation(() => {});
        const spyConsoleGroup = jest.spyOn(global.console, 'group').mockImplementation(() => {});
        const spyConsoleLog = jest.spyOn(global.console, 'log').mockImplementation(() => {});

        const component = shallow(<Dummy testNumber={2} testString={'str'}/>);

        expect(spyConsoleGroup).not.toHaveBeenCalled();
        expect(spyConsoleLog).not.toHaveBeenCalled();

        component.setProps({
            testNumber:2,
            testString: 'str'
        });

        expect(spyConsoleGroup).not.toHaveBeenCalled();
        expect(spyConsoleLog).not.toHaveBeenCalled();

        component.setProps({
            testNumber: 3,
            testString: 'updated'
        });

        expect(spyConsoleGroup).toHaveBeenNthCalledWith(1, '%ctestNumber', '');
        expect(spyConsoleLog).toHaveBeenNthCalledWith(1, '%cbefore', 'font-weight: bold;', 2);
        expect(spyConsoleLog).toHaveBeenNthCalledWith(2, '%cafter', 'font-weight: bold;', 3);

        expect(spyConsoleGroup).toHaveBeenNthCalledWith(2, '%ctestString', '');
        expect(spyConsoleLog).toHaveBeenNthCalledWith(3, '%cbefore', 'font-weight: bold;', 'str');
        expect(spyConsoleLog).toHaveBeenNthCalledWith(4, '%cafter', 'font-weight: bold;', 'updated');

        spyConsoleGroupCollapsed.mockRestore();
        spyConsoleGroup.mockRestore();
        spyConsoleLog.mockRestore();
    });
});
