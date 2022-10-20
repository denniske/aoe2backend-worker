import { PrismaClient } from '@prisma/client/edge'
import {Env} from "./index";

// export const prisma = new PrismaClient({
//     datasources: { db: { url: Deno.env.get('DATA_PROXY_URL') as string } },
// })

export function getPrisma(env: Env) {
  return new PrismaClient({
      datasources: { db: { url: env.DATABASE_URL } },
  });
}
