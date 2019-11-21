import {APPError} from "./APPError";

export interface APIError extends APPError { status: number }

export class APIError extends APPError implements APIError {
  readonly name: string;

  constructor(message: string, code: number, public status: number) {
    super(message, code);

    this.name = "APIError";
  }
}

