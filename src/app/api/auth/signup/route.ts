import { NextResponse } from "next/server"
import { createUser } from "@/lib/client-users"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, age, favoriteGenres } = body

    // basic validation
    if (!email || !password || !name || !age) {
      return NextResponse.json(
        { error: "all fields are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const user = createUser({
      email,
      password,
      name,
      age: Number(age),
      favoriteGenres: favoriteGenres ?? [],
    })

    // don't return the password
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    })
  } catch (err: any) {
    if (err.message === "email already registered") {
      return NextResponse.json(
        { error: "this email is already registered" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    )
  }
}
