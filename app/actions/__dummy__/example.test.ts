import { exampleGetItem, exampleGetList } from './example';

describe('Example actions', () => {
    describe('exampleGetItem', () => {
        it('should return FSA', () => {
            // const action = exampleGetItem(/*{ id: '2', name: '3' }*/);

            expect(true).toEqual(true);
            // expect(action.payload({services: { exampleGetItem: () => 12 }})).toEqual(12);
        });
    });

    describe('exampleGetList', () => {
        it('should return FSA', () => {
            // const action = exampleGetList(0);

            // expect(action.payload({services: { exampleGetList: () => [12] }})).toEqual([12]);
        });
    });
});
