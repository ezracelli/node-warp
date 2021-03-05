import { ServerResponse, STATUS_CODES } from "http";
import type { IResponder } from "./responder";

export class Rejection extends Error implements IResponder {
    statusCode: number;

    constructor (statusCode: number) {
        super(STATUS_CODES[statusCode]);
        this.statusCode = statusCode;
    }

    respond (res: ServerResponse): void | Promise<void> {
        res.statusCode = this.statusCode;
        res.write(`${this.statusCode} ${this.message}`);
    }
}
