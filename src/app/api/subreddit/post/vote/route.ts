import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { PostVoteValidator } from "@/lib/validators/vote"
// import type {CachedPayload} from ""
import { CachedPost } from "@/types/redis"
import { title } from "process"
import { z } from "zod"

const CACHE_AFTER_UPVOTES = 1

export async function PATCH(req: Request){
    try{
        const body = await req.json()
        const {postId, voteType} = PostVoteValidator.parse(body)

        const session = await getAuthSession()
        
        if(!session?.user) {
            return new Response('unauthorized',{status: 401})
        }

        const existingVote = await db.vote.findFirst({
            where: {
                userId: session.user.id,
                postId,
            }
        })

        const post = await db.post.findUnique({
            where:{
                id: postId
            },
            include: {
                author: true,
                votes: true,
            }
        })
        if(!post){
            return new Response('post not found', {status: 404})
        }
        if(existingVote){
            if(existingVote.type === voteType){
                await db.vote.delete({
                    where: {
                        userId_postId:{
                            postId,
                            userId: session.user.id,
                        }
                    }
                })
                return new Response('ok')
            }

            await db.vote.update({
                where: {
                    userId_postId:{
                        postId,
                        userId: session.user.id,
                    },
                },
                data: {
                    type: voteType,
                },
            })

           const voteAmt = post.votes.reduce((acc, vote)=>{
                if(vote.type === 'UP') return acc+1
                if(vote.type === 'DOWN') return acc-1
                return acc
            },0)
            if(voteAmt >= CACHE_AFTER_UPVOTES) {
                const cachePayload:  CachedPost ={
                        authorUsername: post.author.username ?? '',
                        content: JSON.stringify(post.content),
                        id:post.id,
                        title:post.title,
                        currentVote: voteType,
                        createdAt:post.createdAt
                    }
                    await redis.hset(`post:${postId}`,cachePayload)
                } 
                return new Response('ok')
            }
         await db.vote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                postId,
            }
         })

            const voteAmt = post.votes.reduce((acc, vote)=>{
                if(vote.type === 'UP') return acc+1
                if(vote.type === 'DOWN') return acc-1
                return acc
            },0)
            if(voteAmt >= CACHE_AFTER_UPVOTES) {
                const cachePayload:  CachedPost ={
                        authorUsername: post.author.username ?? '',
                        content: JSON.stringify(post.content),
                        id:post.id,
                        title:post.title,
                        currentVote: voteType,
                        createdAt:post.createdAt
                    }
                      await redis.hset(`post:${postId}`,cachePayload)
                }         
                return new Response('ok')
    }catch(error){
        if(error instanceof z.ZodError) {
            return new Response('invalid request data passed', {status: 422})
        }

        return new Response('Could not register vote, please try again later',{status: 500})
    }
}
