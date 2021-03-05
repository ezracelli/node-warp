import type { ServerResponse } from "http";

interface Handler {
    (res: ServerResponse): void | Promise<void>;
}

export interface IResponder {
    respond (res: ServerResponse): void | Promise<void>;
}

export class Responder implements IResponder {
    #handler: Handler;

    constructor (handler: Handler = (res) => {
        res.statusCode = 200;
    }) {
        this.#handler = handler;
    }

    respond (res: ServerResponse): void | Promise<void> {
        return this.#handler(res);
    }
}
