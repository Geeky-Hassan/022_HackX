import {MainAppStoreType} from "@/types";
import {create} from "zustand";
import {persist} from "zustand/middleware";

export const useMainAppStore = create<MainAppStoreType>()(
  persist(
    (set) => ({
      dark: false,
      showChatHistory: false,
      setDark: (dark) => set(() => ({dark})),
      setShowChatHistory: (show) => set(() => ({showChatHistory: show})),
    }),
    {
      name: "main-app-store", // Key for localStorage
    },
  ),
);
