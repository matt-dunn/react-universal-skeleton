export interface APPError extends Error { name: string; code: number }

export class APPError extends Error implements APPError {
  __proto__: Error;
  name: string;
  code: number;

  constructor(message: string, code: number) {
    const trueProto = new.target.prototype;
    super(message);

    this.name = "APPError";
    this.code = code;
    this.__proto__ = trueProto;
  }
}

