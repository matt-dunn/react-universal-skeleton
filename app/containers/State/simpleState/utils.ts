import {ComponentType} from "react";
import {StandardAction, Reducers} from "./getStore";

export type GetProps<C> = C extends ComponentType<infer P> ? P : never;

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Shared<
    InjectedProps,
    DecorationTargetProps
    > = {
    [P in Extract<keyof InjectedProps, keyof DecorationTargetProps>]?: InjectedProps[P] extends DecorationTargetProps[P] ? DecorationTargetProps[P] : never;
};

export type Matching<InjectedProps, DecorationTargetProps> = {
    [P in keyof DecorationTargetProps]: P extends keyof InjectedProps
        ? InjectedProps[P] extends DecorationTargetProps[P]
            ? DecorationTargetProps[P]
            : InjectedProps[P]
        : DecorationTargetProps[P];
};

export type InferableComponentEnhancerWithProps<TInjectedProps, TNeedsProps> =
    <C extends ComponentType<Matching<TInjectedProps, GetProps<C>>>>(
        component: C
    ) => ConnectedComponent<C, Omit<GetProps<C>, keyof Shared<TInjectedProps, GetProps<C>>> & TNeedsProps>;

export type ConnectedComponent<C extends ComponentType<any>, P> = ComponentType<P>

type ActionCreator<P = any, M = any, A extends any[] = any[]> = {
    (...args: A): StandardAction<P, M>;
    type: string;
}

type PayloadCreator<P = any, M = any, A extends any[] = any[]> = {
    (...args: A): P;
}

export const createAction = <P, M, A extends any[] = any[]>(type: string, payloadCreator: PayloadCreator<P, M, A>): ActionCreator<P, M, A> => {
    const action = (...args: A): StandardAction<P, M> => ({
        type,
        payload: payloadCreator(...args)
    });

    action.type = type;

    return action;
};

export const createReducer = <P, M, S, A extends StandardAction<P, M>>(reducers: Reducers<P, M, S, A>) => (state: S, action: A) => {
    const reducer = reducers[action.type];
    return (reducer && reducer(state, action)) || state;
};

export const getType = <P, M, A extends any[] = any[]>(creator: ActionCreator<P, M, A>) => creator.type;

