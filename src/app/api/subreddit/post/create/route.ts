import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request){
    try{

        const session = await getAuthSession()
        if(!session?.user){
            return new Response('unauthorized', {status: 401})
        }

        const body = await req.json()

        const { title, content,subredditId, } = PostValidator.parse(body)

        const subscription = await db.subscription.findFirst({
            where: {
                subredditId,
                userId : session.user.id,
            },
        })

        if(!subscription){
            return new Response('Subscribe to the Post.', {
                status: 400
            })
        }

        await db.post.create({
            data: {
                title,
                content,
                authorId:session.user.id,
                subredditId,
            },
        })

        return new Response('ok')
    }catch(error){
        if(error instanceof z.ZodError) {
            return new Response('invalid request data passed', {status: 422})
        }

        return new Response('Could not post to subreddit, please try again later',{status: 500})
    }
}