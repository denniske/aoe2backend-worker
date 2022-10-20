import {parseISO} from "date-fns";
import {decamelizeKeys} from "humps";

export function parseISONullable(value: string) {
    return value ? parseISO(value) : null;
}

export function bigIntStringifer(key: string, value: any) {
    if (typeof value === 'bigint') {
        return Number(value);
    }
    return value;
}

export function sendResponse(data: any) {
    // res.set('content-type', 'application/json');
    // res.send(JSON.stringify(decamelizeKeys(data), bigIntStringifer));

    return new Response(JSON.stringify(decamelizeKeys(data), bigIntStringifer), {
        headers: {
            'content-type': 'application/json',
        },
    });
}

export function parseIntNullable(value: string) {
    return value ? parseInt(value) : null;
}

const playerColors = [
    '#405BFF',
    '#FF0000',
    '#00FF00',
    '#FFFF00',
    '#00FFFF',
    '#FF57B3',
    '#797979',
    '#FF9600',
];

export function getPlayerBackgroundColor(playerPosition: number) {
    return playerColors[playerPosition - 1];
}



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
