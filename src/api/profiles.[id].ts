import {maxBy} from "lodash";
import {sendResponse} from "../helper/util";
import {getPrisma} from "../db";
import {getTranslation} from "../helper/translation";
import {getLeaderboardEnumFromId, leaderboards} from "../helper/leaderboards";
import {Env} from "../index";
import {getProfiles} from "../service/profile";


const PER_PAGE = 100;

export async function apiProfileSingleRatings(req: Request, env: Env) {
    return sendResponse({
        ratings: true
    });
}

export async function apiProfileSingle(req: Request, env: Env) {
    const prisma = getPrisma();
    const { searchParams, pathname } = new URL(req.url);

    // '/api/profiles/{profileId}'
    const profileId = parseInt(pathname.split('/')[3]);

    console.log('----0');

    // let profile = (await getProfiles({profileId}))[0];

    const language = 'en';
    // const leaderboards = await getLeaderboards(params.profile_id, language, res);
    // const ratings = await getRatings(params.profile_id, language, res);
    // const stats = await getStats(params.profile_id, language, res);

    // console.log('----1');

    const [
        profile,
        leaderboards,
        ratings,
        stats,
    ] = await Promise.all([
        (async () => (await getProfiles({profileId}))[0])(),
        getLeaderboards(profileId, language),
        getRatings(profileId, language),
        getStats(profileId, language),
    ]);

    // console.log('----2', ratings);

    leaderboards.forEach((l: any) => {
        const ratingList = ratings.find(r => r.leaderboardId === l.leaderboardId)?.ratings ?? [];
        l.maxRating = maxBy(ratingList, r => r.rating)?.rating;
    });

    // await asyncForeach(leaderboards, async (l: any) => {
    //     console.log(l);
    //     const ratingList = await prisma.rating.aggregate({
    //         _max: {
    //             rating: true,
    //         },
    //         where: {
    //             leaderboard_id: getLeaderboardIdFromEnum(l.leaderboardId),
    //         },
    //     });
    //     console.log(ratingList);
    //     l.maxRating = ratingList._max.rating;
    // });

    return sendResponse({
        ...profile,
        leaderboards,
        ratings,
        stats,
    });
}

async function getLeaderboards(profileId: number, language: string) {
    const prisma = getPrisma();
    let leaderboardRows = await prisma.leaderboard_row.findMany({
        where: {
            profile_id: profileId,
        },
    });

    const conv = row => ({
        leaderboardId: getLeaderboardEnumFromId(row.leaderboardId),
        leaderboardName: getTranslation(language, 'leaderboard', row.leaderboardId),
        abbreviation: row.abbreviation,
        ...(leaderboardRows.find(l => l.leaderboard_id === row.leaderboardId) ?? {}),
    });

    return leaderboards.map(conv);
}

async function getRating(profileId: number, leaderboard_id: number) {
    const prisma = getPrisma();
    const a = await prisma.rating.findMany({
        // select: {
        //     leaderboard_id: true,
        //     rating: true,
        //     date: true,
        // },
        where: {
            profile_id: profileId,
            leaderboard_id: leaderboard_id,
        },
        orderBy: {
            date: 'desc',
        },
    });
    // console.log(a);
    return a;
}

async function getRatings(profileId: number, language: string) {
    // let ratings = await prisma.rating.findMany({
    //     // select: {
    //     //     leaderboard_id: true,
    //     //     rating: true,
    //     //     date: true,
    //     // },
    //     where: {
    //         profile_id: profileId,
    //     },
    //     orderBy: {
    //         date: 'desc',
    //     },
    // });

    const conv = async row => ({
        leaderboardId: getLeaderboardEnumFromId(row.leaderboardId),
        leaderboardName: getTranslation(language, 'leaderboard', row.leaderboardId),
        abbreviation: row.abbreviation,
        // ratings: ratings.filter(r => r.leaderboard_id === row.leaderboardId),
        ratings: await getRating(profileId, row.leaderboardId),
    });

    return await Promise.all(leaderboards.map(conv));
}

async function getStats(profileId: number, language: string) {
    const conv = async row => ({
        leaderboardId: getLeaderboardEnumFromId(row.leaderboardId),
        leaderboardName: getTranslation(language, 'leaderboard', row.leaderboardId),
        abbreviation: row.abbreviation,
        ...await getStatsForLeaderboard(row.leaderboardId, profileId),
    });

    return await Promise.all(leaderboards.map(conv));
}

async function getStatsForLeaderboard(leaderboardId: number, profileId: number) {
    const prisma = getPrisma();

    const allies = await prisma.$queryRaw`
        SELECT p2.profile_id, pr.name, pr.country, COUNT(*) as games, COUNT(*) filter (where p.won) as wins
        FROM player as p
        JOIN player as p2 ON p2.match_id = p.match_id AND p2.profile_id != p.profile_id AND p2.team = p.team AND p2.team is not null AND p.team is not null
        JOIN profile as pr ON p2.profile_id = pr.profile_id
        JOIN match as m ON m.match_id = p.match_id
        WHERE p.profile_id=${profileId} AND m.leaderboard_id=${leaderboardId} -- AND p.team != -1
        GROUP BY p2.profile_id, pr.name, pr.country
        ORDER BY games desc
        LIMIT 10;
    `;

    const opponents = await prisma.$queryRaw`
        SELECT p2.profile_id, pr.name, pr.country, COUNT(*) as games, COUNT(*) filter (where p.won) as wins
        FROM player as p
        JOIN player as p2 ON p2.match_id = p.match_id AND p2.profile_id != p.profile_id AND p2.team != p.team AND p2.team is not null AND p.team is not null
        JOIN profile as pr ON p2.profile_id = pr.profile_id
        JOIN match as m ON m.match_id = p.match_id
        WHERE p.profile_id=${profileId} AND m.leaderboard_id=${leaderboardId} -- AND p.team != -1
        GROUP BY p2.profile_id, pr.name, pr.country
        ORDER BY games desc
        LIMIT 10;
    `;

    const location = await prisma.$queryRaw`
        SELECT location, COUNT(location) as games, COUNT(*) filter (where won) as wins
        FROM player as p
        JOIN match as m ON m.match_id = p.match_id
        WHERE profile_id=${profileId} AND m.leaderboard_id=${leaderboardId}
        GROUP BY location
        ORDER BY games desc;
    `;

    const civ = await prisma.$queryRaw`
        SELECT civ, COUNT(civ) as games, COUNT(*) filter (where won) as wins
        FROM player as p
        JOIN match as m ON m.match_id = p.match_id
        WHERE profile_id=${profileId} AND m.leaderboard_id=${leaderboardId}
        GROUP BY civ
        ORDER BY games desc;
    `;

    return {
        civ,
        location,
        allies,
        opponents,
    };
}

