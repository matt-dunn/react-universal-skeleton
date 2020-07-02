import { ReactNode } from "react";
import { History } from "history";

export type ErrorLike = {
  message: string;
  name?: string;
  code?: string;
  status?: number;
}

export type ErrorMeta = {
  component: ReactNode;
  includeChildren?: boolean;
};

export type Update = {
  (): void;
}

export type HandleError = {
  (error: ErrorLike, location: string, history: History, props: any, update?: Update): ErrorMeta | undefined | true;
}

export function isErrorMeta (o: any): o is ErrorMeta {
  return o && o.component;
}

export type ActionError = {
  type: string;
  error: ErrorLike;
}
