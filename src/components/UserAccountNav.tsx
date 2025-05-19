"use client"

// import {  } from '@radix-ui/react-dropdown-menu'
import { User } from 'next-auth'
import { FC } from 'react'
import UserAvatar from './UserAvatar'
import { AvatarProps } from '@radix-ui/react-avatar'
import { DropdownMenuItem,DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/DropdownMenu'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface UserAccountNavProps extends AvatarProps{
    user: Pick<User, 'name' | 'image' | 'email'>
}

const UserAccountNav: FC<UserAccountNavProps> = ({user, ...props}) =>{
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar 
                    
                    user = {{
                        name: user.name || null, 
                        image: user.image || null,
                    }}  
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-white' align='end'>
                <div className='flex items-center justify-start gap-2 p-2'>
                    <div className='flex flex-col space-y-1 leading-none border-none'>
                        {user.name && <p className='font-medium'>{user.name}</p>}
                        {user.email && <p className='width-[200px] truncate text-sm text-zinc-700'>{user.email}</p>}
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href='/'>feed</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href='/r/create'>Create community</Link>
                </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                    <Link href='/settings'>Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem onSelect={(event)=>{
                    event.preventDefault()
                    signOut({
                        callbackUrl: `${window.location.origin}/sign-in`
                    })
                }} className='cursor-pointer'>
                    Sign out
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserAccountNav