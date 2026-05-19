// localStorage-based user storage

export interface UserRecord {
  id: string
  email: string
  password: string
  name: string
  age: number
  favoriteGenres: number[]
  createdAt: number
}

const STORAGE_KEY = "cinetrack-users"

function getUsers(): UserRecord[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveUsers(users: UserRecord[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export function findUserByEmail(email: string): UserRecord | undefined {
  return getUsers().find((u) => u.email === email.toLowerCase())
}

export function createUser(data: {
  email: string
  password: string
  name: string
  age: number
  favoriteGenres: number[]
}): UserRecord {
  const email = data.email.toLowerCase()

  if (findUserByEmail(email)) {
    throw new Error("email already registered")
  }

  const user: UserRecord = {
    id: crypto.randomUUID(),
    email,
    password: data.password,
    name: data.name,
    age: data.age,
    favoriteGenres: data.favoriteGenres,
    createdAt: Date.now(),
  }

  const users = getUsers()
  users.push(user)
  saveUsers(users)
  return user
}

export function verifyUser(email: string, password: string): UserRecord | null {
  const user = findUserByEmail(email.toLowerCase())
  if (!user) return null
  if (user.password !== password) return null
  return user
}

export function updateUser(email: string, updates: Partial<Pick<UserRecord, "name" | "age" | "favoriteGenres">>): UserRecord | null {
  const users = getUsers()
  const idx = users.findIndex((u) => u.email === email.toLowerCase())
  if (idx === -1) return null

  users[idx] = { ...users[idx], ...updates }
  saveUsers(users)
  return users[idx]
}
