import {Webhook} from 'svix'
import {headers} from 'next/headers'
import {WebhookEvent} from '@clerk/nextjs/server'

import { db } from '@/lib/db'

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
    
    if(!WEBHOOK_SECRET) {
        throw new Error(
            'Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env'
        )
    }

    // Get headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    //if there are no headers
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        })
    }

    //get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    //create a new svix instanve with yiur secret
    const wh = new Webhook(WEBHOOK_SECRET)

    let evt: WebhookEvent

    //verify the payload with the headers
    try{
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature
        }) as WebhookEvent 
    } catch (err) {
        console.log('Error verifying webhook: ', err)
        return new Response('Error occured -- invalid svix signature', {
            status: 400
        })
    }

    const eventType = evt.type
    console.log(payload.data)

    if (eventType === 'user.created') {
        await db.user.create({
            data: {
                externalUserId: payload.data.id,
                username: payload.data.username,
                phoneNumber: payload.data.phone_numbers[0].phone_number,profileImageUrl: payload.data.image_url
            }
        })
    }

    if(eventType === 'user.updated') {
        await db.user.update({
            where: {
                externalUserId: payload.data.id,
            },
            data: {
                username: payload.data.username,
                phoneNumber: payload.data.phone_numbers[0].phone_number
            }
        })
    }

    if(eventType === 'user.deleted') {
        await db.user.delete({
            where: {
                externalUserId: payload.data.id,
            }
        })
    }

    return new Response('', {status: 200})
}