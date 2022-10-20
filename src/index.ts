import {apiMatches} from "./api/matches";
import {setPrisma} from "./db";
import {apiLeaderboards} from "./api/leaderboards";
import {apiProfiles} from "./api/profiles";
import {apiMaps} from "./api/maps";
import {apiLeaderboardSingle} from "./api/leaderboards.[id]";
import {apiProfileSingle} from "./api/profiles.[id]";

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
        const { url } = request

        if (url.includes('/favicon.ico')) return new Response('');

        const { searchParams, pathname } = new URL(url);


        setPrisma(env);

        // console.log('url', url);
        // console.log(env.DATABASE_URL);

        // if (url.includes('/api/matches?')) return await apiMatches(request, env);

        if (pathname.startsWith('/api/matches')) return await apiMatches(request, env);
        if (pathname.startsWith('/api/leaderboards/')) return await apiLeaderboardSingle(request, env);
        if (pathname.startsWith('/api/leaderboards')) return await apiLeaderboards(request, env);
        if (pathname.startsWith('/api/maps')) return await apiMaps(request, env);
        if (pathname.startsWith('/api/profiles/')) return await apiProfileSingle(request, env);
        if (pathname.startsWith('/api/profiles')) return await apiProfiles(request, env);

        return new Response("Hello World!");
    },
};
