// simple in-memory user store - no db needed
// data persists as long as the server is running
// good enough for a course project

export interface UserRecord {
  id: string
  email: string
  password: string
  name: string
  age: number
  favoriteGenres: number[]
  createdAt: number
}

// in-memory store
const users = new Map<string, UserRecord>()

export function findUserByEmail(email: string): UserRecord | undefined {
  return users.get(email.toLowerCase())
}

export function createUser(data: {
  email: string
  password: string
  name: string
  age: number
  favoriteGenres: number[]
}): UserRecord {
  const email = data.email.toLowerCase()

  // check if already exists
  if (users.has(email)) {
    throw new Error("email already registered")
  }

  const user: UserRecord = {
    id: crypto.randomUUID(),
    email,
    password: data.password, // plain text for course project, never do this in prod
    name: data.name,
    age: data.age,
    favoriteGenres: data.favoriteGenres,
    createdAt: Date.now(),
  }

  users.set(email, user)
  return user
}

export function verifyUser(email: string, password: string): UserRecord | null {
  const user = users.get(email.toLowerCase())
  if (!user) return null
  if (user.password !== password) return null
  return user
}
