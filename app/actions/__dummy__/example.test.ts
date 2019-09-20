import { example, exampleList } from './example';

describe('Example actions', () => {
    describe('example', () => {
        it('should return FSA', () => {
            const action = example({ id: '2', name: '3' });

            expect(action.meta).toEqual({
                id: '2',
                seedPayload: {
                    id: '2',
                    name: '3'
                }
            });

            expect(action.payload({
                inject: () => (cb: Function) => cb({ exampleApi: { example: () => 12 }})
            })).toEqual(12);
        });
    });

    describe('exampleList', () => {
        it('should return FSA', () => {
            const action = exampleList({id: 's', name: 'x'}, { username: '4' });

            expect(action.meta).toEqual({
                id: 's',
                username: '4'
            });

            expect(action.payload({
                inject: () => (cb: Function) => cb({ exampleApi: { exampleList: () => [12] }})
            })).toEqual([12]);
        });
    });
});
