import { createServer } from "http";
import type { Server as HttpServer } from "http";
import { URL } from "url";

import type { Filter } from "./filter";
import { Rejection } from "./rejection";
import type { Responder } from "./responder";

export class Server {
    #filter: Filter<Responder> | Filter<Promise<Responder>>;
    server?: HttpServer;

    constructor (filter: Filter<Responder> | Filter<Promise<Responder>>) {
        this.#filter = filter;
    }

    listen (port?: number, hostname?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let address: string;
            this.server = createServer(async (req, res) => {
                if (req.url) {
                    const uri = `http://${address}${req.url}`;
                    req.originalUri = new URL(uri);
                    req.uri = new URL(uri);
                }

                try {
                    const responder = await this.#filter.apply(req);
                    await responder.respond(res);
                } catch (err) {
                    if (err instanceof Rejection) {
                        err.respond(res);
                    } else console.error(err);
                } finally {
                    res.end();
                }
            });

            this.server.on("listening", () => {
                const address_ = this.server?.address();
                if (address_) {
                    if (typeof address_ === "string") {
                        address = address_;
                    } else {
                        address = `${
                            address_.family === "IPv6"
                                ? `[${address_.address}]`
                                : address_.address
                        }:${address_.port}`;
                    }
                }

                resolve();
            });

            this.server.on("error", (err) => {
                this.server?.close();
                reject(err);
            });

            this.server.listen(port, hostname);
        });
    }
}
