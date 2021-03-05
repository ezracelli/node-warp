import { filters, Responder, Server } from "../src";

const server = new Server(
    filters.method.post()
        .and(filters.path.param())
        .and(filters.path.param())
        .and(filters.path.end())
        .map(() => new Responder(async (res) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            res.statusCode = 201;
            res.write("created!");
        }))
        .or(
            filters.method.get()
                .and(filters.path.path("hi"))
                .and(filters.path.end())
                .map(() => 204)
        ),
);

await server.listen(8000);
console.log("listening on port 8000");
