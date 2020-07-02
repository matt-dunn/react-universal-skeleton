import { ErrorLike } from "./types";

export const errorLike = (error: ErrorLike & {[index: string]: any}): ErrorLike => {
  const { stack, ...rest } = Object.getOwnPropertyNames(error).reduce((o: any, key: string) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    o[key] = error[key];
    return o;
  }, {});

  return rest;
};

export * from "./types";

export * from "./ErrorBoundary";
export * from "./ErrorProvider";
