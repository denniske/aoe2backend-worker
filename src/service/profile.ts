import {getPrisma} from "../db";

export async function getProfiles(props: { search?: string, start?: number, count?: number, profileId?: number, steamId?: string }) {
    const prisma = getPrisma();

    let {
        search,
        start,
        count,
        profileId,
        steamId
    } = props;

    start = start || 1;

    let profiles: any[] = [];
    if (search != null) {
        profiles = await prisma.$queryRaw`
                SELECT p.profile_id, p.name, country, SUM(wins+losses) as games
                FROM profile as p
                LEFT JOIN leaderboard_row lr on p.profile_id = lr.profile_id
                WHERE p.name ILIKE ${search}
                GROUP BY p.profile_id
                ORDER BY SUM(wins+losses) desc NULLS LAST
                OFFSET ${start - 1}
                LIMIT ${count}
            `;
    } else if (profileId != null) {
        profiles = await prisma.$queryRaw`
                SELECT p.profile_id, p.name, country, SUM(wins+losses) as games
                FROM profile as p
                LEFT JOIN leaderboard_row lr on p.profile_id = lr.profile_id
                WHERE p.profile_id = ${profileId}
                GROUP BY p.profile_id
                ORDER BY SUM(wins+losses) desc NULLS LAST
                OFFSET ${start - 1}
                LIMIT ${count}
            `;
    } else if (steamId != null) {
        profiles = await prisma.$queryRaw`
                SELECT p.profile_id, p.name, country, SUM(wins+losses) as games
                FROM profile as p
                LEFT JOIN leaderboard_row lr on p.profile_id = lr.profile_id
                WHERE p.steam_id = ${steamId}
                GROUP BY p.profile_id
                ORDER BY SUM(wins+losses) desc NULLS LAST
                OFFSET ${start - 1}
                LIMIT ${count}
            `;
    }
    return profiles;
}
