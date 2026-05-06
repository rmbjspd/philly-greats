import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(`${request.nextUrl.origin}/admin`, { status: 303 })
  response.cookies.delete('admin_token')
  return response
}
