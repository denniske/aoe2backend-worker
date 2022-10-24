import {apiMatches} from "./api/matches";
import {apiLeaderboardSingle} from "./api/leaderboards.[id]";
import {apiLeaderboards} from "./api/leaderboards";
import {apiMaps} from "./api/maps";
import {apiProfileSingle, apiProfileSingleRatings} from "./api/profiles.[id]";
import {apiProfiles} from "./api/profiles";
import {Env} from "./index";


function pathMatches(path: string, pattern: string) {
    const parts = path.split('/');
    const patterns = pattern.split('/');
    for (const _pattern of patterns) {
        const part = parts.shift();
        console.log(part, _pattern);
        if (part === undefined) return false;
        if (_pattern === '*') continue;
        // if (_pattern.startsWith(':')) {
        //     const key = _pattern.substring(1);
        // }
        if (_pattern !== part) return false;
    }
    return true;
}


export async function route(request: Request, env: Env) : Promise<Response> {
    const {url} = request

    if (url.includes('/favicon.ico')) {
        return new Response('');
    }

    const {searchParams, pathname} = new URL(url);

    if (pathname.startsWith('/api/matches')) return await apiMatches(request, env);
    if (pathname.startsWith('/api/leaderboards/')) return await apiLeaderboardSingle(request, env);
    if (pathname.startsWith('/api/leaderboards')) return await apiLeaderboards(request, env);
    if (pathname.startsWith('/api/maps')) return await apiMaps(request, env);
    if (pathMatches(pathname, '/api/profiles/*/ratings')) return await apiProfileSingleRatings(request, env);
    if (pathMatches(pathname, '/api/profiles/*')) return await apiProfileSingle(request, env);
    if (pathname.startsWith('/api/profiles')) return await apiProfiles(request, env);

    return new Response("Hello World!");
}