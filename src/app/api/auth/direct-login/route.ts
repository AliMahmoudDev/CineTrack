import { NextRequest, NextResponse } from "next/server"
import { encode } from "next-auth/jwt"

// direct login - creates JWT session without NextAuth redirect
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userInfo } = body

    if (!userInfo) {
      return NextResponse.json(
        { error: "User info is required" },
        { status: 400 }
      )
    }

    let user
    try {
      user = JSON.parse(userInfo)
    } catch {
      return NextResponse.json(
        { error: "Invalid user info format" },
        { status: 400 }
      )
    }

    if (!user?.id || !user?.email) {
      return NextResponse.json(
        { error: "User info must include id and email" },
        { status: 400 }
      )
    }

    const secret = process.env.NEXTAUTH_SECRET || "cinetrack-fallback-secret-for-dev"

    const forwardedProto = request.headers.get("x-forwarded-proto")
    const isSecure = forwardedProto === "https" || request.nextUrl.protocol === "https:"

    const sessionToken = await encode({
      token: {
        id: user.id,
        name: user.name || user.email.split("@")[0],
        email: user.email,
      },
      secret,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    const cookieName = isSecure
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token"

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name || user.email.split("@")[0],
        email: user.email,
      },
    })

    response.cookies.set(cookieName, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: isSecure,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return response
  } catch (error: any) {
    console.error("[Direct Login API] Error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
