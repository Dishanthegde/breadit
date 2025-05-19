import type { Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'


type UserId = string

declare module 'next-auth/jwt' {
    interface JWT {
        id: UserId
        username?: string | null
    }
}

declare module "next-auth"{
    interface Session{
        user:{
            id: UserId
            name?: string | null
            email?: string | null
            image?: string | null
            username?: string | null
        }
    }

    interface User {
        id: UserId
        username?: string | null
  }
} 