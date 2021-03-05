# warp

[warp](https://github.com/seanmonstar/warp), the Node.js edition.

> A super-easy, composable, web server framework for warp speeds.
>
> The fundamental building block of `warp` is the `Filter`: they can be combined and composed to express rich requirements on requests.
>
> Thanks to its `Filter` system, `warp` provides these out of the box:
>
> * Path routing and parameter extraction
> * Header requirements and extraction
> * Query string deserialization
> * JSON and Form bodies
> * Multipart form data
> * Static Files and Directories
> * Websockets
> * Access logging
> * Gzip, Deflate, and Brotli compression

**Currently, only `method` and `path` filters are implemented.**

```typescript
import { Server } from "warp";
import { method, path } from "warp/filters";

const hello = path.path("hello")
    .and(path.param())
    .and(path.end())
    .map((name) => `Hello, ${name}!`);

const goodbye = path.path("goodbye")
    .and(path.param())
    .and(path.end())
    .map((name) => `Goodbye, ${name}!`);

const filters = hello.or(goodbye);
const server = new Server(filters);
await server.listen(8000);
```
