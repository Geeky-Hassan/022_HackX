import { ChatHistoryType, MessageType, StateType, ThemeType } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const stateStore = create<StateType>()(
  persist(
    (set) => ({
      user: null,
      userName: "",
      img: "",
      email: "",
      open: false,
      department: "SST",
      offset: 50,
      totalData: 0,
      reglo: true,
      isLoading: false,
      error: null,
      messages: [] as MessageType[],
      selectedChat: null,
      isCollapsed: false,
      friendProfile: false,
      chats: [], // Initialize chats as an empty array
      theme: "light",
      setChats: (chats) => set({ chats }),
      setUser: (user) => set(() => ({ user: user })),
      setUserName: (name: string) => set(() => ({ userName: name })),
      setEmail: (email: string) => set(() => ({ email: email })),
      setTotalData: (total) => set(() => ({ totalData: total })),
      setDepartment: (dept: string) => set(() => ({ department: dept })),
      setOffset: () => set((state) => ({ offset: state.offset + 50 })),
      setOpen: () => set((state) => ({ open: !state.open })),
      setReglo: () => set((state) => ({ reglo: !state.reglo })),
      setLoading: (loading: boolean) => set(() => ({ isLoading: loading })),
      setError: (error: string | null) => set(() => ({ error })),
      setMessages: (messages: MessageType[] | ((prev: MessageType[]) => MessageType[])) =>
        set((state) => ({
          messages: typeof messages === "function" ? messages(state.messages) : messages,
        })),
      setSelectedChat: (selectedChat: null | ChatHistoryType) => set(() => ({ selectedChat })),
      setFriendProfile: (profile) => set(() => ({ friendProfile: profile })),
      setTheme: (theme: ThemeType) => set(() => ({ theme: theme })),
      setIsCollapsed: (collapsed: boolean) => set(() => ({ isCollapsed: collapsed })),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ userName: state.userName, user: state.user, email: state.email, theme: state.theme, isCollapsed: state.isCollapsed }),
    },
  ),
);

export default stateStore;
