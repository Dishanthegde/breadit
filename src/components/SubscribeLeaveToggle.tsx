"use client"


import { FC, startTransition } from 'react' 
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit'
import axios, { AxiosError } from 'axios'
import {Toaster, toast, useToaster} from 'react-hot-toast'
import { useRouter } from 'next/navigation'



interface SubscribeLeaveToggleProps {
    subredditId: string
    subredditName: string
    isSubscribed: boolean
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({subredditId, subredditName,isSubscribed})=> {
    // const isSubscribed = false
    const router = useRouter()

    const {mutate: subscribe, isLoading: isSubLoading} = useMutation({
        mutationFn: async ()=> {
            const payload: SubscribeToSubredditPayload = {
                subredditId,
            }
            const {data} = await axios.post('/api/subreddit/subscribe',payload)
            return data as string
        },
        onError: (err)=>{
            if(err instanceof AxiosError){
                if(err.response?.status === 401){
                    toast.error('you need to login first')
                    return
                }
            }
            return toast.error('something went wrong please try again',{
                position: 'bottom-right',
                duration: 5000, // 5 seconds
                style: { background: '#f44336', color: 'white' },
            })
        },
        onSuccess:() => {
            startTransition(() => {
                router.refresh()
            })

            return toast.success(`You are now subscribed to r/${subredditName}`)
        },
    })


    const {mutate: unsubscribe, isLoading: isunSubLoading} = useMutation({
        mutationFn: async ()=> {
            const payload: SubscribeToSubredditPayload = {
                subredditId,
            }
            const {data} = await axios.post('/api/subreddit/unsubscribe',payload)
            return data as string
        },
        onError: (err)=>{
            if(err instanceof AxiosError){
                if(err.response?.status === 401){
                    toast.error('you need to login first')
                    return
                }
            }
            return toast.error('something went wrong please try again',{
                position: 'bottom-right',
                duration: 5000, // 5 seconds
                style: { background: '#f44336', color: 'white' },
            })
        },
        onSuccess:() => {
            startTransition(() => {
                router.refresh()
            })

            return toast.success(`You are now unsubscribed to r/${subredditName}`)
        },
    })

    return (
        isSubscribed ? (
        <Button onClick={()=> unsubscribe()} isLoading={isunSubLoading} className='w-full mt-1 mb-4'>Leave Community</Button>
    ): (
        <Button onClick={()=> subscribe()} isLoading={isSubLoading} className='w-full mt-1 mb-4'>Join to Post</Button>
    )
    )
}

export default SubscribeLeaveToggle