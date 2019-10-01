// import { exampleGetItem, exampleGetList } from './example';
//
// describe('Example actions', () => {
//     describe('exampleGetItem', () => {
//         it('should return FSA', () => {
//             const action = exampleGetItem(/*{ id: '2', name: '3' }*/);
//
//             // expect(action.meta).toEqual({
//             //     id: '2',
//             //     seedPayload: {
//             //         id: '2',
//             //         name: '3'
//             //     }
//             // });
//
//             expect(action.payload({
//                 inject: () => (cb: Function) => cb({ exampleApi: { example: () => 12 }})
//             })).toEqual(12);
//         });
//     });
//
//     describe('exampleGetList', () => {
//         it('should return FSA', () => {
//             const action = exampleGetList(/*{id: 's', name: 'x'}, { username: '4' }*/);
//
//             // expect(action.meta).toEqual({
//             //     id: 's',
//             //     username: '4'
//             // });
//
//             expect(action.payload({
//                 inject: () => (cb: Function) => cb({ exampleApi: { exampleGetList: () => [12] }})
//             })).toEqual([12]);
//         });
//     });
// });
