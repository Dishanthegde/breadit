import { type } from 'os'
import { z } from 'zod'

export const SubredditValidator = z.object({
    name: z.string().min(3).max(21),
})

export const SubredditSubscriptionValidator = z.object({
    subredditId : z.string()
})

export type CreateSubredditPayLoad = z.infer<typeof SubredditValidator>
export type SubscribeToSubredditPayload = z.infer <typeof SubredditSubscriptionValidator>