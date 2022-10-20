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
}

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        return new Response("Hello World!");
    },
};


// addEventListener('fetch', (event) => {
//     event.respondWith(handleEvent(event))
// })
//
// async function handleEvent(event: FetchEvent): Promise<Response> {
//     const { request } = event
//     const { url } = request
//
//     console.log('url', url);
//
//     if (url.includes('/api/matches?')) {
//         return await apiMatches(request);
//     }
//
//     // waitUntil method is used for sending logs, after response is sent
//     // event.waitUntil(
//     //     prisma.api_key.create({
//     //         data: {
//     //             api_key: 'Info ' + new Date(),
//     //         },
//     //     }).then()
//     // )
//
//     // await prisma.api_key.create({
//     //     data: {
//     //         api_key: 'Info ' + new Date(),
//     //     },
//     // })
//
//     return new Response(`request method: ${request.method}!`)
// }