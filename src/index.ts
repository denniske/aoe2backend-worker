import {setPrisma} from "./db";
import {route} from "./routes";

export interface Env {
    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    AOE2COMPANION: KVNamespace;

    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace;
    //
    // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
    // MY_BUCKET: R2Bucket;

    DATABASE_URL: string;
    KV_API_KEY: string;
}

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        const { url } = request

        if (url.includes('/favicon.ico')) return new Response('');

        await setPrisma(env);

        // const result = await fetch('https://www.google.de');
        // const result = await fetch('http://localhost:4300/');
        // const result = await fetch('https://pdp.localhost/');
        // console.log('===>', result.status);
        // return new Response("Hello World!");

        // console.log('url', url);
        console.log(env.DATABASE_URL);

        return await route(request, env);
    },
};
