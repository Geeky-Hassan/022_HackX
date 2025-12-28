import {ChatbotChatType, ChatbotMessageType} from "@/types";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

type ChatMode = "chat" | "quiz";

interface ExtendedChatbotType extends ChatbotChatType {
  mode: ChatMode;
  messages: ChatbotMessageType[];
  quizCurrentQuestion: number;
  quizSelectedAnswers: (number | null)[];
  setMode: (mode: ChatMode) => void;
  setQuizCurrentQuestion: (index: number) => void;
  setQuizSelectedAnswers: (answers: (number | null)[]) => void;
  resetQuizState: () => void;
}

export const useChatbotStore = create<ExtendedChatbotType>()(
  persist(
    (set) => ({
      sessionID: undefined,
      newChat: true,
      fetchChat: false,
      agentName: "",
      thinking: false,
      deepThink: "",
      allowedWords: 5000,
      remainingWords: 5000,
      messages: [],
      inputMessage: "",
      mode: "chat",
      quizCurrentQuestion: 0,
      quizSelectedAnswers: [],
      setSessionID: (sessionId) => set({sessionID: sessionId}),
      setAgentName: (name) => set({agentName: name}),
      setDeepThink: (deepThink) => set({deepThink}),
      setNewChat: (value: boolean) => set({newChat: value}),
      setFetchChat: (value: boolean) => set({fetchChat: value}),
      setThinking: (thinking) => set({thinking}),
      setRemainingWords: (remainingWords) => set({remainingWords}),
      setMode: (mode) => set({mode}),
      setQuizCurrentQuestion: (index) => set({quizCurrentQuestion: index}),
      setQuizSelectedAnswers: (answers) => set({quizSelectedAnswers: answers}),
      resetQuizState: () =>
        set({
          mode: "chat",
          quizCurrentQuestion: 0,
          quizSelectedAnswers: [],
        }),
      // Modified to handle both direct arrays and updater functions
      setMessages: (messages) =>
        set((state) => ({
          messages: typeof messages === "function" ? messages(state.messages) : messages,
        })),
      setInputMessage: (inputMessage) =>
        set((state) => ({
          inputMessage:
            typeof inputMessage === "function"
              ? inputMessage(state.inputMessage ?? "")
              : inputMessage,
        })),
    }),
    {
      name: "myPath-chatbot-store",
      storage: createJSONStorage(() => sessionStorage), // Change to sessionStorage
      partialize: (state) => ({
        // Only persist specific fields
        sessionID: state.sessionID,
        messages: state.messages,
        agentName: state.agentName,
        mode: state.mode,
        quizCurrentQuestion: state.quizCurrentQuestion,
        quizSelectedAnswers: state.quizSelectedAnswers,
      }),
    },
  ),
);
