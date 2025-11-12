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
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          const data = await res.json()

          if (!res.ok || data.status !== 'success') {
            console.error('❌ Login failed in authorize():', data)

        return null
          }

          // ✅ Extract token correctly from nested structure
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

    // maxAge:undefined,

    // updateAge:0

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



// check code
// // src/libs/nextAuthOptions.js
// import CredentialsProvider from 'next-auth/providers/credentials'
// import GoogleProvider from 'next-auth/providers/google'
// import { PrismaAdapter } from '@auth/prisma-adapter'
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// export const authOptions = {
//   adapter: PrismaAdapter(prisma),

//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'text' },
//         password: { label: 'Password', type: 'password' }
//       },
//       async authorize(credentials) {
//         const { email, password } = credentials

//         try {
//           const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login/`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password })
//           })

//           const data = await res.json()

//           if (!res.ok || !data?.user || !data?.token) {
//             console.error('Login failed:', data)
//             return null
//           }

//           // Must return a valid user object
//           return {
//             id: data.user.id,
//             name: data.user.name,
//             email: data.user.email || email,
//             apiToken: data.token // store your API token
//           }
//         } catch (e) {
//           console.error('Authorize error:', e)
//           return null
//         }
//       }
//     }),

//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET
//     })
//   ],

//   session: {
//     strategy: 'jwt',
//     maxAge: 30 * 24 * 60 * 60 // 30 days
//   },

//   pages: {
//     signIn: '/login'
//   },

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.name = user.name
//         token.apiToken = user.apiToken // match authorize return
//       }
//       return token
//     },

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.name = token.name
//         session.user.apiToken = token.apiToken
//       }
//       return session
//     }
//   }
// }
