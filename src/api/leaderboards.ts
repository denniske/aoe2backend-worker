import {sendResponse} from "../helper/util";
import {getPrisma} from "../db";
import {getTranslation} from "../helper/translation";
import {getLeaderboardEnumFromId, leaderboards} from "../helper/leaderboards";
import {Env} from "../index";

export async function apiLeaderboards(req: Request, env: Env) {
    const prisma = getPrisma(env);
    const { searchParams } = new URL(req.url);
    const language = 'en';
    const conv = row => ({
        leaderboardId: getLeaderboardEnumFromId(row.leaderboardId),
        leaderboardName: getTranslation(language, 'leaderboard', row.leaderboardId),
        abbreviation: row.abbreviation,
    });

    return sendResponse(leaderboards.map(conv));
}
