import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
  interface User {
    role: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Restrict to Parul University accounts
      if (!user.email?.endsWith('@paruluniversity.ac.in')) return false
      return true
    },
    async session({ session, user }) {
      session.user.id = user.id
      session.user.role = (user as { role?: string }).role ?? 'STUDENT'
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
