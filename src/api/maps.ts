import {maps} from "../helper/maps";
import {sendResponse} from "../helper/util";
import {getPrisma} from "../db";
import {getTranslation} from "../helper/translation";
import {Env} from "../index";


export async function apiMaps(req: Request, env: Env) {
    const prisma = getPrisma();
    const { searchParams } = new URL(req.url);
    const language = 'en';
    const conv = row => {
        row.name = getTranslation(language, 'map_type', row.mapId);
        row.imageUrl = `http://localhost:4200/maps/${row.imageUrl}.png`;
        return row;
    };

    return sendResponse([...maps].map(conv));
}
