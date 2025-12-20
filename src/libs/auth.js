// src/libs/nextAuthOptions.js
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/libs/prisma'

export const authOptions = {
  // adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        apiToken: { label: 'Token', type: 'text' }
      },
      async authorize(credentials) {
        try {
          // ✅ If the frontend already has a token, trust it.
          if (credentials.apiToken) {
            return {
              id: 1,
              email: credentials.email,
              name: credentials.email,
              token: credentials.apiToken
            }
          }

          // Otherwise, perform login via backend
          const res = await fetch('https://motor-match.genplusinnovations.com/api/admin/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          let data
          const text = await res.text()

          try {
            data = JSON.parse(text)
          } catch (e) {
            console.error('❌ Login failed: Invalid JSON response', text.substring(0, 200))
            return null
          }

          if (!res.ok || data.status !== 'success') {
            console.error('❌ Login failed in authorize():', data)
            return null
          }

          const token =
            data?.access ||
            data?.token ||
            data?.data?.access ||
            data?.data?.token ||
            null

          return {
            id: data?.data?.id || 1,
            name: data?.data?.name || credentials.email,
            email: credentials.email,
            token
          }
        } catch (err) {
          console.error('❌ authorize() error:', err)
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
    maxAge: 30 * 24 * 60 * 60
  },

  pages: {
    signIn: '/login'
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name
        token.email = user.email
        token.accessToken = user.token // ✅ use unified field name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email
        session.user.apiToken = token.accessToken
      }
      return session
    }
  }
}
