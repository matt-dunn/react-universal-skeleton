import {APPError, IAPPError} from "./APPError";

export interface IAPIError extends IAPPError { readonly status: number }

export class APIError extends APPError implements IAPIError {
  readonly name: string;

  constructor(message: string, code: string, public status: number) {
    super(message, code);

    this.name = 'APIError';
  }
}

