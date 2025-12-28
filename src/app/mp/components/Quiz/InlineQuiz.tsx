"use client";

import { useEffect, useRef, useState } from "react";
import quizStore from "@/app/mp/store/quizStore";
import { useChatbotStore } from "../../store/chatbotStore";
import CustomMarkdown from "../global/ReactMarkdown";
import { createChatAlert } from "../global/constants";
import ConfirmationModal from "../Modal/ConfirmationModal";

const InlineQuiz = ({ sessionId }: { sessionId: string | undefined }) => {
  const { quiz, quiz_id, setShowQuiz, setTotalScore, resetQuiz } = quizStore();
  const {
    quizCurrentQuestion,
    quizSelectedAnswers,
    setQuizCurrentQuestion,
    setQuizSelectedAnswers,
    resetQuizState,
    setMode,
    setMessages,
  } = useChatbotStore();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState("");
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const pendingActionRef = useRef<{ type: "navigate" | "back" | null; href?: string | null }>({ type: null, href: null });
  const guardInitializedRef = useRef(false);

  // Load saved answer for current question
  useEffect(() => {
    setSelectedAnswer(quizSelectedAnswers[quizCurrentQuestion] || null);
  }, [quizCurrentQuestion, quizSelectedAnswers]);

  // Initialize quiz state
  useEffect(() => {
    if (quiz.length > 0 && quizSelectedAnswers.length === 0) {
      setQuizSelectedAnswers(Array(quiz.length).fill(null));
    }
  }, [quiz, quizSelectedAnswers.length, setQuizSelectedAnswers]);

  // Handle quiz completion
  useEffect(() => {
    if (showResult) {
      const submitQuizResults = async () => {
        setIsSubmitting(true);
        try {
          // Format user answers for socket submission
          const userAnswers = quiz.map((question, index) => ({
            question: question.question,
            answer: question.options[quizSelectedAnswers[index] || 0] || "",
          }));

          const submitData = {
            conversation_id: sessionId,
            quiz_id: quiz_id,
            user_answers: userAnswers,
          };

          // Use socket to submit quiz instead of HTTP
          const { socket } = await import("@/lib/socketClient");
          await socket.emit("submit_quiz", submitData);

          setAnalysisMessage("Grading your answers...");

          // Close quiz modal after delay - feedback will come through standard pathai_chunk events
          setTimeout(() => {
            setAnalysisMessage("");
            handleQuizComplete();
          }, 2000);
        } catch (error) {
          console.error("Error submitting quiz:", error);
          setAnalysisMessage("Failed to submit quiz results. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      };

      submitQuizResults();
    }
  }, [showResult, quiz_id, quizSelectedAnswers, sessionId, quiz]);

  // Add beforeunload warning (browser-native prompt on refresh/close)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "You have an active quiz. If you leave, your attempt will be cancelled.";
      return "You have an active quiz. If you leave, your attempt will be cancelled.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Intercept internal navigations (anchor clicks) while quiz is active
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;
      // Allow external/new tab links to proceed
      const isExternal = anchor.target === '_blank' || /^(https?:|mailto:|tel:)/i.test(href);
      if (isExternal) return;
      // Only intercept when quiz is active
      if (quiz.length === 0) return;
      event.preventDefault();
      pendingActionRef.current = { type: "navigate", href };
      setShowLeaveConfirm(true);
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => document.removeEventListener('click', handleDocumentClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.length]);

  // Intercept browser back/forward attempts using a history guard
  useEffect(() => {
    if (guardInitializedRef.current) return;
    guardInitializedRef.current = true;
    const stateMarker = { quizGuard: true };
    try {
      history.pushState(stateMarker, "");
    } catch { }

    const onPopState = () => {
      // Only guard if a quiz is active
      if (quiz.length === 0) return;
      // Immediately push state back to prevent leaving
      try {
        history.pushState(stateMarker, "");
      } catch { }
      pendingActionRef.current = { type: "back" };
      setShowLeaveConfirm(true);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.length]);

  const normalizeCorrectIndex = (q: (typeof quiz)[number]): number | null => {
    const correct: any = q.correct_answer as any;
    if (typeof correct === "number") {
      // Support both 0-based and 1-based indices coming from the backend
      if (correct >= 1 && correct <= q.options.length) return correct - 1;
      if (correct >= 0 && correct < q.options.length) return correct;
      return null;
    }
    if (typeof correct === "string") {
      const idx = q.options.findIndex((o) => String(o).trim().toLowerCase() === correct.trim().toLowerCase());
      return idx >= 0 ? idx : null;
    }
    return null;
  };

  const computeScore = (answers: Array<number | null>): number => {
    try {
      return quiz.reduce((acc, q, i) => {
        const selected = answers[i];
        const correctIdx = normalizeCorrectIndex(q);
        return acc + (selected != null && correctIdx != null && selected === correctIdx ? 1 : 0);
      }, 0);
    } catch {
      return 0;
    }
  };

  const handleQuizComplete = () => {
    // Get the final score computed just before completion
    const finalScore = score;

    // Add completion alert to chat
    const completionAlert = createChatAlert({
      conversation_id: sessionId,
      alertType: "quiz-complete",
      title: "Quiz Completed!",
      message: `You scored ${finalScore} out of ${quiz.length} questions.`,
      score: `${finalScore}/${quiz.length}`,
    });

    setMessages((prevMessages) => [...prevMessages, completionAlert]);

    resetQuiz(); // Reset quiz store
    resetQuizState(); // Reset chatbot state (returns to chat mode)
    setScore(0);
    setShowResult(false);
    setAnalysisMessage("");
  };

  const handleCancelQuiz = () => {
    // Add cancellation alert to chat
    const cancellationAlert = createChatAlert({
      conversation_id: sessionId,
      alertType: "quiz-cancel",
      title: "Quiz Cancelled",
      message: "You cancelled the quiz. No results were generated.",
    });

    setMessages((prevMessages) => [...prevMessages, cancellationAlert]);

    resetQuiz();
    resetQuizState();
    setScore(0);
    setMode("chat");
    setShowResult(false);
    setAnalysisMessage("");
  };

  const confirmLeave = () => {
    setShowLeaveConfirm(false);
    // Cancel quiz
    handleCancelQuiz();
  };

  const closeLeaveConfirm = () => {
    pendingActionRef.current = { type: null, href: null };
    setShowLeaveConfirm(false);
  };

  const handleNextQuestion = () => {
    // Update the selectedAnswers array with current selection
    const updatedAnswers = [...quizSelectedAnswers];
    updatedAnswers[quizCurrentQuestion] = selectedAnswer;
    setQuizSelectedAnswers(updatedAnswers);

    // Move to next question or compute final score if this was last
    if (quizCurrentQuestion < quiz.length - 1) {
      setQuizCurrentQuestion(quizCurrentQuestion + 1);
    } else {
      const finalScore = computeScore(updatedAnswers);
      setScore(finalScore);
      setTotalScore(finalScore);
      setShowResult(true);
    }
  };

  const handleAnswerSelection = (index: number) => {
    setSelectedAnswer(index);
  };

  if (showResult) {
    return (
      <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto my-auto p-4 pb-32 flex items-center justify-center">
        <div className="bg-text-blue/5 rounded-xl shadow-sm border border-text-blue/20 p-6 w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-logo-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-gray-800 mb-2">Quiz Completed!</h2>
            <p className="text-gray-600 mb-4">
              You scored <span className="font-semibold text-blue-600">{score}</span> out of{" "}
              <span className="font-semibold">{quiz.length}</span>
            </p>
            {isSubmitting && (
              <div className="text-blue-500 mb-4">
                <div className="inline-flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting results...
                </div>
              </div>
            )}
            {analysisMessage && (
              <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                {analysisMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || quiz.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto p-4 pb-32">
      <div className="overflow-hidden">
        {/* Header with Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Question {quizCurrentQuestion + 1} of {quiz.length}
            </h2>
            <button
              onClick={() => {
                pendingActionRef.current = { type: "navigate", href: window.location.href };
                setShowLeaveConfirm(true);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              title="Cancel Quiz"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((quizCurrentQuestion + 1) / quiz.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Content */}
        <div className="">
          <div className="mb-6">
            <CustomMarkdown content={quiz[quizCurrentQuestion].question} />
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quiz[quizCurrentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelection(index)}
                className={`w-full text-left px-4 py-4 rounded-lg border-2 transition-all duration-200 ${selectedAnswer === index
                  ? "bg-blue-50 border-blue-500 text-blue-900"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800"
                  } flex items-center space-x-3`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAnswer === index ? "border-blue-500 bg-blue-500" : "border-gray-300"
                    }`}
                >
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </button>
            ))}
          </div>

          {/* Next Button */}
          <div className="flex mt-6 justify-center">
            <button
              onClick={handleNextQuestion}
              className={`px-6 py-2 bg-logo-primary text-white rounded-md hover:bg-logo-primary-gradient transition-colors duration-200 flex items-center space-x-2 ${selectedAnswer === null ? "invisible cursor-not-allowed" : ""}`}
            >
              <span>{quizCurrentQuestion < quiz.length - 1 ? "Next" : "Finish"}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showLeaveConfirm}
        onClose={closeLeaveConfirm}
        onConfirm={confirmLeave}
      />
    </div>
  );
};

export default InlineQuiz;

