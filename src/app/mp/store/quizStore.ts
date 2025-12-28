import { QuizType, StateQuizType } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExtendedQuizType extends StateQuizType {
  resetQuiz: () => void;
}

const quizStore = create<ExtendedQuizType>()(
  persist(
    (set) => ({
      quiz_id: "",
      showQuiz: false,
      quiz: [] as Array<QuizType>, // Corrected the initialization of quiz
      totalScore: 0,
      setQuizId: (quizId: string) => set(() => ({ quiz_id: quizId })),
      setShowQuiz: () => set((state) => ({ showQuiz: !state.showQuiz })),
      setQuiz: (quiz: Array<QuizType>) => set(() => ({ quiz })), // Fixed parameter usage
      setTotalScore: (score) => set({ totalScore: score }),
      resetQuiz: () => set({
        quiz_id: "",
        showQuiz: false,
        quiz: [],
        totalScore: 0,
      }),
    }),
    {
      name: "mypath-user-storage", // Persisted storage name
    },
  ),
);

export default quizStore;
