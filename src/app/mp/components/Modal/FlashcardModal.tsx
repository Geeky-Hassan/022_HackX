"use client";

import { useState, useEffect } from "react";
import { X, GalleryVerticalEnd, Play, Eye, EyeClosed } from "lucide-react";
import flashcardStore from "../../store/flashCardStore";
import { motion, AnimatePresence } from "framer-motion";

interface FlashcardModalProps {
  onClose: () => void;
}

const FlashcardModal = ({ onClose }: FlashcardModalProps) => {
  const { flashcards, flashcardTitle } = flashcardStore();
  const [selectedFlashcardSet, setSelectedFlashcardSet] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionSet, setTransitionSet] = useState<any>(null);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);

  // Mock flashcard sets for demonstration - in real app this would come from store/API
  const flashcardSets = [
    {
      id: 1,
      title: flashcardTitle || "Recent Flashcards",
      subject: "Mixed Topics",
      count: flashcards.length,
      flashcards: flashcards,
      lastUsed: "Today"
    }
  ];

  const handleSelectFlashcardSet = (set: any) => {
    setIsTransitioning(true);
    setTransitionSet(set);

    // Start the unfolding animation
    setTimeout(() => {
      setSelectedFlashcardSet(set);
      setCurrentIndex(0);
      setIsFlipped(false);
      setDirection(null); // Reset direction when opening new set
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionSet(null);
      }, 800); // Allow time for the player to fully appear
    }, 1200); // Longer delay for dramatic effect
  };

  const nextCard = () => {
    if (selectedFlashcardSet && currentIndex < selectedFlashcardSet.flashcards.length - 1) {
      setDirection("next");
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setDirection("prev");
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(prev => !prev);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (selectedFlashcardSet) {
        if (e.key === "ArrowRight") nextCard();
        if (e.key === "ArrowLeft") prevCard();
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          flipCard();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedFlashcardSet, currentIndex, onClose]);

  // Animation variants
  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: -50,
      transition: {
        duration: 0.3
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const cardVariants = {
    initial: (dir: any) => ({ x: dir === "next" ? 40 : dir === "prev" ? -40 : 0, opacity: 0, scale: 0.99 }),
    animate: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: any) => ({ x: dir === "next" ? -40 : dir === "prev" ? 40 : 0, opacity: 0, scale: 0.99 }),
  };

  const setItemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }),
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    unfolding: {
      scale: [1, 1.05, 1.1, 15],
      rotateY: [0, 5, 10, 0],
      rotateX: [0, -2, -5, 0],
      borderRadius: ["12px", "16px", "20px", "16px"],
      boxShadow: [
        "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        "0 20px 25px -5px rgb(0 0 0 / 0.1)",
        "0 25px 50px -12px rgb(0 0 0 / 0.25)"
      ],
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        times: [0, 0.3, 0.6, 1]
      }
    }
  };  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Morphing overlay during transition */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              className="absolute inset-0 z-10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated background particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full"
                    initial={{
                      x: Math.random() * window.innerWidth,
                      y: Math.random() * window.innerHeight,
                      scale: 0,
                      opacity: 0
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 0.6, 0],
                      x: Math.random() * window.innerWidth,
                      y: Math.random() * window.innerHeight,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>

              {/* Pulsing glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent rounded-full"
                animate={{
                  scale: [1, 1.5, 2, 1],
                  opacity: [0.3, 0.6, 0.2, 0.3]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Ripple effect */}
              <motion.div
                className="absolute inset-0 border-2 border-blue-400/30 rounded-full"
                animate={{
                  scale: [0.8, 2, 3],
                  opacity: [0.6, 0.2, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.2,
                  ease: "easeOut"
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <GalleryVerticalEnd className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedFlashcardSet ? selectedFlashcardSet.title : "Flashcard Library"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!selectedFlashcardSet ? (
            // Flashcard sets list
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your Flashcard Sets</h3>
                <p className="text-gray-600">Select a flashcard set to start studying</p>
              </div>

              {flashcardSets.length === 0 || flashcards.length === 0 ? (
                <div className="text-center py-12">
                  <GalleryVerticalEnd className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No flashcards yet</h3>
                  <p className="text-gray-600">Create flashcards in your chat to see them here</p>
                </div>
              ) : (
                <motion.div 
                  className="grid gap-4"
                  initial="hidden"
                  animate="visible"
                >
                  {flashcardSets.map((set, index) => (
                    <motion.div
                      key={set.id}
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        isTransitioning && transitionSet?.id === set.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                      variants={setItemVariants}
                      custom={index}
                      animate={
                        isTransitioning && transitionSet?.id === set.id
                          ? "unfolding"
                          : "visible"
                      }
                      whileHover={!isTransitioning ? "hover" : undefined}
                      whileTap={!isTransitioning ? { scale: 0.98 } : undefined}
                      onClick={() => !isTransitioning && handleSelectFlashcardSet(set)}
                      style={{
                        pointerEvents: isTransitioning ? 'none' : 'auto'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{set.title}</h4>
                          <p className="text-sm text-gray-600">{set.subject}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {set.count} cards • Last used {set.lastUsed}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {set.count} cards
                          </span>
                          <Play className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          ) : (
            // Flashcard player view
            <div>
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setSelectedFlashcardSet(null)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Library
                </button>
                <div className="text-sm text-gray-600">
                  {currentIndex + 1} of {selectedFlashcardSet.flashcards.length}
                </div>
              </div>

              {/* Flashcard Display */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-2xl">
                  {/* Card Deck */}
                  <div className="relative h-80 mb-6 [perspective:1200px]">
                    {/* Background deck cards */}
                    {selectedFlashcardSet.flashcards.length > 1 && (
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Generate background cards based on total count */}
                        {Array.from({ length: Math.min(4, selectedFlashcardSet.flashcards.length - 1) }).map((_, i) => {
                          const cardIndex = (currentIndex + i + 1) % selectedFlashcardSet.flashcards.length;
                          const randomRotation = (Math.sin(cardIndex * 2.5) * 3); // Consistent random rotation
                          const randomX = (Math.sin(cardIndex * 1.7) * 8); // Consistent random X offset
                          const randomY = (Math.cos(cardIndex * 2.1) * 6); // Consistent random Y offset
                          const scale = 1 - (i + 1) * 0.03; // Slightly smaller as we go back
                          const zIndex = -(i + 1);
                          
                          return (
                            <motion.div
                              key={`bg-${cardIndex}-${i}`}
                              className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-lg border border-gray-200"
                              style={{
                                transform: `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg) scale(${scale})`,zIndex: zIndex,
                                opacity: 0.6 - i * 0.15
                              }}
                              animate={{
                                scale: scale,
                                x: randomX,
                                y: randomY,
                                rotate: randomRotation
                              }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* Main active card */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        className="relative w-full h-full cursor-pointer [transform-style:preserve-3d] z-10"
                        variants={cardVariants}
                        custom={direction}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.45, ease: [0.2, 0.9, 0.2, 1] }}
                        style={{ 
                          transformStyle: "preserve-3d"
                        }}
                        onClick={flipCard}
                      >
                        <motion.div
                          className="relative w-full h-full"
                          animate={{ rotateY: isFlipped ? 180 : 0 }}
                          transition={{ duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
                          style={{ transformStyle: "preserve-3d" }}
                        >
                      {/* Front */}
                      <div className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 flex flex-col justify-center items-center text-center [backface-visibility:hidden]">
                        <div className="text-sm text-gray-500 mb-4">Question</div>
                        <div className="text-xl font-semibold text-gray-900 break-words">
                          {selectedFlashcardSet.flashcards[currentIndex]?.front}
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                          Click to reveal answer
                        </div>
                      </div>

                      {/* Back */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-gray-200 p-8 flex flex-col justify-center items-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <div className="text-sm text-gray-600 mb-4">Answer</div>
                        <div className="text-xl font-semibold text-gray-900 break-words">
                          {selectedFlashcardSet.flashcards[currentIndex]?.back}
                        </div>
                        <div className="mt-6">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedFlashcardSet.flashcards[currentIndex]?.difficulty === "easy"
                              ? "bg-green-100 text-green-800"
                              : selectedFlashcardSet.flashcards[currentIndex]?.difficulty === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {selectedFlashcardSet.flashcards[currentIndex]?.difficulty}
                          </span>
                        </div>
                      </div>
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={prevCard}
                      disabled={currentIndex === 0}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentIndex === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Previous
                    </button>

                    <button
                      onClick={flipCard}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {isFlipped ? <EyeClosed className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={nextCard}
                      disabled={currentIndex === selectedFlashcardSet.flashcards.length - 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentIndex === selectedFlashcardSet.flashcards.length - 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${((currentIndex + 1) / selectedFlashcardSet.flashcards.length) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-0">
                      {currentIndex + 1} / {selectedFlashcardSet.flashcards.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FlashcardModal;