import {sendResponse} from "../helper/util";
import {getPrisma} from "../db";
import {Env} from "../index";
import {getProfiles} from "../service/profile";


const PER_PAGE = 20;

export async function apiProfiles(req: Request, env: Env) {
    const prisma = getPrisma();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') ?? '1');
    const steamId = searchParams.get('steam_id') || null;
    const profileId = parseInt(searchParams.get('profile_id')) || null;
    let search = searchParams.get('search') || null;

    const start = (page - 1) * PER_PAGE + 1;
    const count = PER_PAGE;

    if (search) {
        search = `%${search}%`;
    }

    let profiles = await getProfiles({search, start, count, profileId, steamId});

    return sendResponse({
        start: start,
        count: count,
        profiles,
    });
}
