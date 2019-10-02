export interface IAPPError extends Error { readonly name: string; readonly code: string }

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

