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
    LOCAL: boolean;
}

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        const url = new URL(request.url);
        // url.hostname = 'data2.aoe2companion.com';

        console.log(url.hostname);
        console.log(url.hostname.replace('aoe2companion.com', 'internal.aoe2companion.com'));

        url.hostname = 'legacy2.aoe2companion.com';
        return fetch(url.toString(), request);
    },
};
