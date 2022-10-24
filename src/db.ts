// import {PrismaClient} from '@prisma/client/edge'
// import type {PrismaClient} from '@prisma/client/edge'
import {Env} from "./index";


let _prisma: any;

export function getPrisma(): any {
    return _prisma;
}

// export function setPrisma(env: Env) {
//   _prisma = new PrismaClient({
//       datasources: { db: { url: env.DATABASE_URL } },
//   });
//   _prisma.$disconnect()
// }

export async function setPrisma(env: Env) {
    const {PrismaClient} = await import('@prisma/client/edge')
    _prisma = new PrismaClient({
        // log: ['query', 'info', 'warn'],
        datasources: {db: {url: env.DATABASE_URL}},
    });
    _prisma.$disconnect()
}

// async function getPrismaClient() {
//     const { PrismaClient } = await import('@prisma/client/edge')
//     return new PrismaClient({
//         datasources: {
//             db: {
//                 url: config.databaseUrl
//             }
//         }
//     })
// }
