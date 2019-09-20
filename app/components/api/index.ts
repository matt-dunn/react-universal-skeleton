export interface IAPPError extends Error { readonly name: string; readonly code: string; }

export interface IAPIError extends IAPPError { readonly status: number; }

export class APPError extends Error implements IAPPError {
  __proto__: Error;
  readonly name: string;
  readonly code: string;

  constructor(message: string, code: string) {
    const trueProto = new.target.prototype;
    super(message);

    this.name = 'APPError';
    this.code = code;
    this.__proto__ = trueProto;
  }
}

export class APIError extends APPError implements IAPIError {
  readonly name: string;

  constructor(message: string, code: string, public status: number) {
    super(message, code);

    this.name = 'APIError';
  }
}

