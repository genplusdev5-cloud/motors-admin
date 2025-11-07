// src/libs/nextAuthOptions.js
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })

          const data = await res.json()

          if (!res.ok) {
            console.error('Login failed:', data)

            return null
          }

          // Must return an object (with id, name, email at minimum)
          return {
            id: data?.user?.id || 1,
            name: data?.user?.name || email,
            email,
            apiToken: data?.token || data?.access || null
          }
        } catch (e) {
          console.error('Authorize error:', e)

          return null
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  pages: {
    signIn: '/login'
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name
        token.accessToken = user?.token || user?.accessToken || null
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name
        session.user.apiToken = token.accessToken
      }

      return session
    }
  }
}
