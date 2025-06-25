// stores/useUserStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserState {
  coins: number
  addCoins: (amount: number) => void
  deductCoins: (amount: number) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      coins: 0, 
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      deductCoins: (amount) => set((state) => ({ coins: state.coins - amount })),
    }),
    {
      name: "user-store", 
    }
  )
)
