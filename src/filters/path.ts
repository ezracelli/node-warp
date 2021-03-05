import { Filter } from "../filter";
import { Rejection } from "../rejection";

export const end = (): Filter => new Filter((req) => {
    if (!req.uri) return;
    if (/^\/+([^/?#]+)(?=(?:\/|$))/.test(req.uri.pathname)) {
        throw new Rejection(404);
    }
});

export const full = (): Filter<string> => new Filter((req) => {
    if (!req.originalUri) throw new Rejection(404);
    return req.originalUri.pathname;
});

export const param = (): Filter<string> => new Filter((req) => {
    if (!req.uri) throw new Rejection(404);

    const [match, param] = req.uri.pathname.match(/^\/+([^/?#]+)(?=(?:\/|$))/) ?? [];
    if (!match || !param) throw new Rejection(404);

    req.uri.pathname = req.uri.pathname.replace(match, "");
    return param;
});

export const path = (matcher: string | RegExp): Filter => {
    const matcher_ = new RegExp(matcher instanceof RegExp ? matcher.source : matcher);
    const param_ = param();

    return new Filter((req) => {
        const p = param_.apply(req);
        if (!matcher_.test(p)) throw new Rejection(404);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        req.url = req.url!.replace(matcher_, "");
    });
};

export const tail = (): Filter<string> => new Filter((req) => {
    if (!req.uri) throw new Rejection(404);
    return req.uri.pathname;
});
