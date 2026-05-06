import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.formData()
  const password = body.get('password') as string
  const adminSecret = process.env.ADMIN_SECRET
  const origin = request.nextUrl.origin

  if (!adminSecret || password !== adminSecret) {
    return NextResponse.redirect(`${origin}/admin?error=1`, { status: 303 })
  }

  const response = NextResponse.redirect(`${origin}/admin`, { status: 303 })
  response.cookies.set('admin_token', adminSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return response
}
