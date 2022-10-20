import {apiMatches} from "./api/matches";

export interface Env {
    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    // MY_KV_NAMESPACE: KVNamespace;
    //
    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace;
    //
    // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
    // MY_BUCKET: R2Bucket;

    DATABASE_URL: string;
}

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        const {url} = request

        if (url.includes('/favicon.ico')) return new Response('');

        // console.log('url', url);
        // console.log(env.DATABASE_URL);

        if (url.includes('/api/matches?')) {
            return await apiMatches(request, env);
        }
        return new Response("Hello World!");
    },
};
