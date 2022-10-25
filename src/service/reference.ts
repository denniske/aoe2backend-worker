import {CACHE_VERIFIED_PLAYERS} from "../api/matches";
import {Env} from "../index";

export interface IReferencePlayer {
    name: string;
    country: string;
    esportsearnings: number;
    aoeelo: number;
    liquipedia: string;
    twitch: string;
    youtube: string;
    discord: string;
    discordServerId: string;
    platforms: {
        rl?: string[],
    };
    aka: string[];
    douyu: string;
    mixer: string;
}

let referencePlayers: IReferencePlayer[];
let referencePlayersDict: Record<number, IReferencePlayer>;

export async function getFromCache(env: Env, key: string, fallback: any) {
    if (env.LOCAL) {
        const response = await fetch('https://legacy.aoe2companion.com/kv/get?key=' + key);
        const str = await response.text();
        return str.length > 0 ? JSON.parse(str) : fallback;
    }
    const str = await env.AOE2COMPANION.get(CACHE_VERIFIED_PLAYERS);
    return str ? JSON.parse(str) : fallback;
}

export async function getReferencePlayersDict(env: Env) {
    console.log('===>', env.AOE2COMPANION);
    console.log('===>', env);
    if (!referencePlayers) {
        referencePlayers = await getFromCache(env, CACHE_VERIFIED_PLAYERS, []);
        referencePlayersDict = {};
        for (const player of referencePlayers) {
            for (const relicId of player.platforms.rl || []) {
                referencePlayersDict[relicId] = player;
            }
        }
    }
    return referencePlayersDict;
}
