import { create } from "zustand"
import { persist } from "zustand/middleware"

type UserProps = {
  id: string
  firstName: string
  lastName: string
  userName: string
  avatar: string
  lastUpdated: string
  email: string
  token: string
}

type UserStoreProps = {
  user: UserProps | null
  hasHydrated: boolean
  setUser: (user: UserProps) => void
  logOut: () => void
  setHasHydrated: (value: boolean) => void
  updateUser: (updates: Partial<UserProps>) => void
}

export const useUser = create<UserStoreProps>()(
  persist(
    (set, get) => ({
      user: null,
      hasHydrated: false,
      setUser: (user) => {
        console.log("Setting user:", user)
        set({ user })
      },
      logOut: () => {
        console.log("Logging out user")
        set({ user: null })
      },
      setHasHydrated: (value) => {
        console.log("Setting hasHydrated:", value)
        set({ hasHydrated: value })
      },
      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates }
          console.log("Updating user:", updatedUser)
          set({ user: updatedUser })
        }
      },
    }),
    {
      name: "tasky-user",
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrating user store, state:", state)
        // Mark hydration complete
        state?.setHasHydrated(true)
      },
    },
  ),
)

export default useUser
