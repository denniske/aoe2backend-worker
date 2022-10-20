import {sendResponse} from "../helper/util";
import {getPrisma} from "../db";
import {Env} from "../index";
import {getLeaderboardEnumFromId, getLeaderboardIdFromEnum} from "../helper/leaderboards";

const PER_PAGE = 100;

export async function apiLeaderboardSingle(req: Request, env: Env) {
    const prisma = getPrisma();
    const { searchParams, pathname } = new URL(req.url);
    // await sleep(2000);

    // console.log(req.params);
    // return;

    // '/api/leaderboards/{leaderboardId}'
    const leaderboardId = pathname.split('/')[3];

    const page = parseInt(searchParams.get('page') ?? '1');
    let country = searchParams.get('country') || null;
    const steamId = searchParams.get('steam_id') || null;
    const profileId = parseInt(searchParams.get('profile_id')) || null;
    const search = searchParams.get('search') || null;

    const start = (page - 1) * PER_PAGE + 1;
    const count = PER_PAGE;

    if (country) {
        country = country.toLowerCase();
    }

    const conv = row => {
        row.leaderboardId = getLeaderboardEnumFromId(row.leaderboardId);
        row.games = row.wins + row.losses;
        row.country = row.profile.country;
        delete row.profile;
        return row;
    };

    if (profileId) {
        const leaderboardRow = await prisma.leaderboard_row.findUnique({
            include: {
                profile: true,
            },
            where: {
                leaderboard_id_profile_id: {
                    leaderboard_id: getLeaderboardIdFromEnum(leaderboardId),
                    profile_id: profileId,
                },
            },
        });
        if (leaderboardRow == null) {
            return sendResponse({
                leaderboard_id: getLeaderboardIdFromEnum(leaderboardId),
                players: [],
            });
        }
        return sendResponse({
            leaderboard_id: getLeaderboardIdFromEnum(leaderboardId),
            players: [
                conv(leaderboardRow),
            ],
        });
    }

    const leaderboardRows = await prisma.leaderboard_row.findMany({
        include: {
            profile: true,
        },
        where: {
            leaderboard_id: getLeaderboardIdFromEnum(leaderboardId),
            ...(country && {profile: {country}}),
            ...(search && {name: {contains: search, mode: "insensitive"}}),
        },
        skip: start - 1,
        take: count,
        orderBy: {
            ['rank']: 'asc',
        },
    });

    // console.log(leaderboardRows);

    if (country) {
        leaderboardRows.forEach(row => row.rank = row.rank_country);
    }

    // const cacheKey = CACHE_LEADERBOARD_COUNT.replace('${leaderboardId}', getLeaderboardIdFromEnum(leaderboardId));
    // const cache = JSON.parse(await redis.get(cacheKey) || '{}');
    const total = -1; //cache[country || 'world'] || 0;

    return sendResponse({
        leaderboard_id: leaderboardId,
        total: total,
        start: start,
        count: count,
        country: country,
        page: page,
        players: leaderboardRows.map(conv),
    });
}

export const CACHE_LEADERBOARD_COUNT = 'leaderboard-count-${leaderboardId}';
