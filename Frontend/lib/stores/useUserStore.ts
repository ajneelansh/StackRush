import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileData {
  name: string;
  email: string;
  location: string;
  college: string;
  batch: string;
  profilePicture?: string;
}

interface UserState {
  coins: number;
  profile: ProfileData;
  addCoins: (amount: number) => void;
  deductCoins: (amount: number) => void;
  setProfile: (data: Partial<ProfileData>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      coins: 0,
      profile: {
        name: "",
        email: "",
        location: "",
        college: "",
        batch: "2026",
        profilePicture: "",
      },
      addCoins: (amount) =>
        set((state) => ({ coins: state.coins + amount })),
      deductCoins: (amount) =>
        set((state) => ({ coins: state.coins - amount })),
      setProfile: (data) =>
        set((state) => ({
          profile: { ...state.profile, ...data },
        })),
    }),
    {
      name: "user-store", // localStorage key
    }
  )
);
