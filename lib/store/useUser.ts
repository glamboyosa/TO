import { create } from "zustand"

import { PrismaUser } from "@/types/user"

interface UserState {
  user: PrismaUser | null
  setUser: (user: PrismaUser) => void
}

const useUser = create<UserState>((set) => ({
  user: null,
  setUser: (user) => () => ({ user }),
}))
export default useUser
