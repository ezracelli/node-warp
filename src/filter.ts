import type { IncomingMessage } from "http";
import { Responder } from "./responder";

interface Handler<T> {
    (req: IncomingMessage): T;
}

export class Filter<T = void> {
    #handler: Handler<T>;

    constructor (handler: Handler<T>) {
        this.#handler = handler;
    }

    apply (req: IncomingMessage): T {
        return this.#handler(req);
    }

    and <T2>(filter: Filter<T2>): And<T, T2> {
        return new And(this.#handler, filter.#handler);
    }

    andThen (handler: (args: T) => Promise<unknown>): Filter<Promise<Responder>> {
        return new Filter(async (req) => {
            const args = this.apply(req);
            const responder = await handler(args);

            if (responder instanceof Responder) {
                return responder;
            } else if (typeof responder === "string") {
                return new Responder((res) => {
                    res.write(responder);
                });
            } else if (typeof responder === "number") {
                return new Responder((res) => {
                    res.statusCode = responder;
                });
            } else {
                return new Responder((res) => {
                    res.write(JSON.stringify(responder));
                });
            }
        });
    }

    map (handler: (args: T) => unknown): Filter<Responder> {
        return new Filter((req) => {
            const args = this.apply(req);
            const responder = handler(args);

            if (responder instanceof Responder) {
                return responder;
            } else if (typeof responder === "string") {
                return new Responder((res) => {
                    res.write(responder);
                });
            } else if (typeof responder === "number") {
                return new Responder((res) => {
                    res.statusCode = responder;
                });
            } else {
                return new Responder((res) => {
                    res.write(JSON.stringify(responder));
                });
            }
        });
    }

    or <T2>(filter: Filter<T2>): Or<T, T2> {
        return new Or(this.#handler, filter.#handler);
    }
}

class And<T1 = void, T2 = void> extends Filter<[T1, T2]> {
    #lhs: Handler<T1>;
    #rhs: Handler<T2>;

    constructor (lhs: Handler<T1>, rhs: Handler<T2>) {
        super((req) => {
            return [
                this.#lhs(req),
                this.#rhs(req),
            ];
        });

        this.#lhs = lhs;
        this.#rhs = rhs;
    }
}

class Or<T1 = void, T2 = void> extends Filter<T1 | T2> {
    #lhs: Handler<T1>;
    #rhs: Handler<T2>;

    constructor (lhs: Handler<T1>, rhs: Handler<T2>) {
        super((req) => {
            try {
                return this.#lhs(req);
            } catch {
                return this.#rhs(req);
            }
        });

        this.#lhs = lhs;
        this.#rhs = rhs;
    }
}
