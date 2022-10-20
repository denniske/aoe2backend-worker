import { PrismaClient } from '@prisma/client/edge'
const prisma = new PrismaClient()

addEventListener('fetch', (event) => {
    event.respondWith(handleEvent(event))
})

async function handleEvent(event: FetchEvent): Promise<Response> {
    const { request } = event

    // waitUntil method is used for sending logs, after response is sent
    // event.waitUntil(
    //     prisma.api_key.create({
    //         data: {
    //             api_key: 'Info ' + new Date(),
    //         },
    //     }).then()
    // )

    await prisma.api_key.create({
        data: {
            api_key: 'Info ' + new Date(),
        },
    })

    return new Response(`request method: ${request.method}!`)
}