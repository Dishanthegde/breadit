"use client"
import { FC, useState } from "react";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";
import {signIn} from "next-auth/react"
import { Icons } from "./Icons";
import { toast } from 'react-hot-toast'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement>{}

const UserAuthForm: FC<UserAuthFormProps>=({ className, ...props })=>{

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const loginwithGoogle = async()=>{
        setIsLoading(true)
        try{
            // throw new Error();
            await signIn('google')
        }catch(error){
            toast.error('There was an error logging in with Google', {
                position:'bottom-right',
                duration: 5000, // 5 seconds
                style: { background: '#f44336', color: 'white' },
            });


        }finally{
            setIsLoading(false)
        }
    }


    return( 
        <div className={cn('flex justify-center',className)} {...props}>
            <Button onClick={loginwithGoogle} isLoading={isLoading} size='sm' className='w-full'> {isLoading ? null : <Icons.google className='h-4 w-4 mr-2'/>}GOOGLE</Button>
        </div>
    )
}

export default UserAuthForm 