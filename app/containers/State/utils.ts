import {ComponentType} from "react";

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

export type ErrorLike = {
    message: string;
    name?: string;
    code?: string;
    status?: number;
}

export const errorLike = (error: ErrorLike & {[index: string]: any}): ErrorLike => {
    const {stack, ...rest} = Object.getOwnPropertyNames(error).reduce((o: any, key: string) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        o[key] = error[key];
        return o;
    }, {});

    return rest;
};

