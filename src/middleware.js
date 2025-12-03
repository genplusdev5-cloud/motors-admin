// src/middleware.js
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const { pathname } = req.nextUrl

  // Static / public files – skip
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  // Get lang from "/en/..." etc.
  const segments = pathname.split('/').filter(Boolean)
  const lang = segments[0] || 'en'

  const isAuthRoute =
    pathname === `/${lang}/login` || pathname === `/${lang}/forgot-password`

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  })

  // If not logged in and trying to access private route → redirect to login
  if (!token && !isAuthRoute) {
    const loginUrl = new URL(`/${lang}/login`, req.url)
    return NextResponse.redirect(loginUrl)
  }

  // If logged in and trying to access login page → redirect to dashboard
  if (token && isAuthRoute) {
    const dashboardUrl = new URL(`/${lang}/dashboard`, req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|public|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)'
  ]
}

