import {FlashcardType, StateFlashcardType} from "@/types";
import {create} from "zustand";
import {persist} from "zustand/middleware";

interface ExtendedFlashcardType extends StateFlashcardType {
  resetFlashcards: () => void;
}

const flashcardStore = create<ExtendedFlashcardType>()(
  persist(
    (set) => ({
      flashcardTitle: "",
      flashcards: [],
      showFlashcard: false,
      setFlashcards: (flashcards: Array<FlashcardType>) => set(() => ({flashcards})),
      setShowFlashcard: (bool: boolean) => set(() => ({showFlashcard: bool})),
      resetFlashcards: () => set(() => ({flashcards: [], showFlashcard: false})),
      setFlashcardTitle: (title: string) => set(() => ({flashcardTitle: title})),
    }),
    {
      name: "flashcard-storage", // Persisted storage name
    },
  ),
);

export default flashcardStore;