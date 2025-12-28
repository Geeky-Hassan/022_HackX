"use client";

import { useEffect, useState } from "react";
import quizStore from "@/app/mp/store/quizStore";
import CustomMarkdown from "../global/ReactMarkdown";
import { quizResultHandler } from "../../mpHandler/quizHandler";

const QuizModal = ({ sessionId }: { sessionId: string | undefined }) => {
  const { quiz, quiz_id, setShowQuiz, setTotalScore } = quizStore();
  const [isClosing, setIsClosing] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(quiz.length).fill(null),
  );
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState("");

  useEffect(() => {
    setSelectedAnswers(Array(quiz.length).fill(null));
  }, [quiz]);

  // API call when showResult becomes true
  useEffect(() => {
    if (showResult) {
      const submitQuizResults = async () => {
        setIsSubmitting(true);
        try {
          // Format user answers for socket submission
          const userAnswers = quiz.map((question, index) => ({
            question: question.question,
            answer: question.options[selectedAnswers[index] || 0] || "",
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
          setTimeout(() => {
            setAnalysisMessage("PathAI will provide you a detailed analysis now. You can close this.");
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
  }, [showResult, quiz_id, selectedAnswers, quiz]);

  const closeModal = () => {
    if (showResult) {
      setIsClosing(true);
      setTimeout(() => {
        setShowQuiz();
      }, 300);
    }
  };

  const handleNextQuestion = () => {
    // Update the selectedAnswers array with current selection
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = selectedAnswer;
    setSelectedAnswers(updatedAnswers);

    // Check if answer is correct and update score
    if (selectedAnswer === quiz[currentQuestionIndex].correct_answer) {
      setScore((prev) => prev + 1);
    }

    // Move to next question or show results
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(selectedAnswers[currentQuestionIndex + 1]); // Pre-load next answer if exists
    } else {
      setShowResult(true);
      setTotalScore(score + (selectedAnswer === quiz[currentQuestionIndex].correct_answer ? 1 : 0));
    }
  };

  const handleAnswerSelection = (index: number) => {
    setSelectedAnswer(index);
  };

  if (showResult) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div
          className={`bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Quiz Result</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">
                You scored {score} out of {quiz.length}!
              </p>
            </div>
            {isSubmitting && <p className="text-blue-500 mt-2">Submitting results...</p>}
            {analysisMessage && (
              <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg animate-fade-in">
                {analysisMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-xl transform transition-all duration-300 ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Question {currentQuestionIndex + 1} of {quiz.length}
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div className="mb-6">
            <CustomMarkdown content={quiz[currentQuestionIndex].question} />
            <div className="space-y-3">
              {quiz[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelection(index)}
                  className={`w-full text-left px-4 py-2 rounded-lg border ${selectedAnswer === index
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                    } transition-colors duration-200`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex < quiz.length - 1 ? "Next" : "Finish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
