import { PrismaClient } from '@prisma/client/edge'
import {Env} from "./index";


let _prisma: PrismaClient;

export function getPrisma(): PrismaClient {
  return _prisma;
}

export function setPrisma(env: Env) {
  _prisma = new PrismaClient({
      datasources: { db: { url: env.DATABASE_URL } },
  });
}
