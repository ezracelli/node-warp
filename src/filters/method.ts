import { Filter } from "../filter";
import { Rejection } from "../rejection";

export const method = (): Filter<string> => new Filter((req) => {
    if (!req.method) throw new Rejection(405);
    return req.method;
});

export enum Method {
    CONNECT = "CONNECT",
    DELETE = "DELETE",
    GET = "GET",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
    PATCH = "PATCH",
    POST = "POST",
    PUT = "PUT",
    TRACE = "TRACE",
}

export const connect = (): Filter => new Filter((req) => {
    if (req.method !== Method.CONNECT) throw new Rejection(405);
});

export const del = (): Filter => new Filter((req) => {
    if (req.method !== Method.DELETE) throw new Rejection(405);
});

export const get = (): Filter => new Filter((req) => {
    if (req.method !== Method.GET) throw new Rejection(405);
});

export const head = (): Filter => new Filter((req) => {
    if (req.method !== Method.HEAD) throw new Rejection(405);
});

export const options = (): Filter => new Filter((req) => {
    if (req.method !== Method.OPTIONS) throw new Rejection(405);
});

export const patch = (): Filter => new Filter((req) => {
    if (req.method !== Method.PATCH) throw new Rejection(405);
});

export const post = (): Filter => new Filter((req) => {
    if (req.method !== Method.POST) throw new Rejection(405);
});

export const put = (): Filter => new Filter((req) => {
    if (req.method !== Method.PUT) throw new Rejection(405);
});

export const trace = (): Filter => new Filter((req) => {
    if (req.method !== Method.TRACE) throw new Rejection(405);
});
