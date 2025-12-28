"use client";
import Image from "next/image";
import {useState, useRef, useEffect, memo, useCallback} from "react";
import CustomMarkdown from "../../components/global/ReactMarkdown";
import {CopyButton, ThumbsDown, ThumbsUp} from "../../components/CopyButton";
import {ChevronDown, FileIcon, X, ExternalLink, Eye, EyeClosed} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {socket} from "@/lib/socketClient";
import {useChatbotStore} from "../../store/chatbotStore";
import Cookies from "js-cookie";
import HighlightedMessage from "../../components/global/HighlightedMessage";
import ChatAlert from "../../components/global/ChatAlert";
import quizStore from "../../store/quizStore";
import {useToast} from "../../components/Toast";
import {events} from "@/data/socket/constants";
// Video visualization components
import VideoStatusIndicator from "./VideoStatusIndicator";
import VideoPlayerComponent from "./VideoPlayerComponent";
import StoryBookComponent from "./StoryBookComponent";
import StoryBookStatus from "./StoryBookStatus";
// PPT components
import PPTPlayerComponent from "./PPTPlayerComponent";
import PPTStatusIndicator from "./PPTStatusIndicator";
import {Streamdown} from "streamdown";
import flashcardStore from "../../store/flashCardStore";

// FlashcardStack Component (modernized inline preview)
const FlashcardStack = memo(({ flashcards, title }: { flashcards: any[]; title: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const total = flashcards?.length || 0;

  // framer-motion variants for sliding cards; uses custom prop = direction
  const slideVariants = {
    initial: (dir: any) => ({ x: dir === "next" ? 40 : dir === "prev" ? -40 : 0, opacity: 0, scale: 0.99 }),
    animate: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: any) => ({ x: dir === "next" ? -40 : dir === "prev" ? 40 : 0, opacity: 0, scale: 0.99 }),
  };

  const nextCard = () => {
    if (currentIndex < total - 1 && !isAnimating) {
      setDirection("next");
      setIsAnimating(true);
      setCurrentIndex((s) => s + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0 && !isAnimating) {
      setDirection("prev");
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((s) => s - 1);
        setIsFlipped(false);
        setTimeout(() => setIsAnimating(false), 250);
      }, 60);
    }
  };

  const flipCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped((s) => !s);
    window.setTimeout(() => setIsAnimating(false), 600);
    setDirection(null);
  };

  // keyboard navigation while component is focused
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextCard();
      else if (e.key === "ArrowLeft") prevCard();
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        flipCard();
      }
    };

    el.addEventListener("keydown", handleKey as any);
    return () => el.removeEventListener("keydown", handleKey as any);
  }, [currentIndex, isAnimating, total]);

  if (!flashcards || total === 0) return null;

  return (
    <div className="mt-6 w-full max-w-lg mx-auto" ref={containerRef} tabIndex={0} aria-label={`Flashcard stack: ${title}`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-blue-600">{title}</h4>
          <p className="text-sm text-gray-500">{currentIndex + 1} / {total}</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              flipCard();
            }}
            aria-label={isFlipped ? "Hide answer" : "Show answer"}
            whileTap={{ scale: 0.95 }}
            animate={{ rotate: isFlipped ? 12 : 0, scale: isFlipped ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="p-2 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200"
          >
            {isFlipped ? <EyeClosed className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Card + layered background */}
      <div className="relative">
        {/* layered background cards for depth */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-11/12 h-64 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 transform -rotate-1 scale-95 shadow-sm" />
          <div className="w-11/12 h-64 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 transform rotate-1 scale-90 shadow-sm absolute" />
        </div>

        {/* main interactive card (framer-motion) */}
        <div className="relative h-64 w-full">
          {/** slideVariants control entry/exit x offsets based on direction **/}
          

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onAnimationStart={() => setIsAnimating(true)}
              onAnimationComplete={() => setIsAnimating(false)}
              transition={{ duration: 0.45, ease: [0.2, 0.9, 0.2, 1] }}
              className="mx-auto h-full max-w-md cursor-pointer [perspective:1200px]"
              onClick={flipCard}
              role="button"
              aria-pressed={isFlipped}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") flipCard();
              }}
            >
              <motion.div
                className="relative w-full h-full [transform-style:preserve-3d]"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
                style={{ transformStyle: "preserve-3d" }}
                onAnimationComplete={() => {
                  // flip completed
                }}
              >
                {/* front */}
                <div className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 flex flex-col justify-center items-center text-center [backface-visibility:hidden]">
                  <div className="text-sm text-gray-500 mb-2">Question</div>
                  <div className="text-lg font-semibold text-gray-900 break-words">{flashcards[currentIndex].front}</div>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center text-sm text-gray-600">
                    Click to flip
                  </div>
                </div>

                {/* back */}
                <div className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl border border-gray-100 p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-white to-blue-50 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div className="text-sm text-gray-600 mb-2">Answer</div>
                  <div className="text-lg font-semibold text-gray-900 break-words">{flashcards[currentIndex].back}</div>
                  <div className="mt-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      flashcards[currentIndex].difficulty === "easy"
                        ? "bg-green-100 text-green-800"
                        : flashcards[currentIndex].difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {flashcards[currentIndex].difficulty}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* floating nav buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevCard();
          }}
          disabled={currentIndex === 0}
          aria-label="Previous flashcard"
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-transform ${
            currentIndex === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:scale-105"
          }`}
        >
          <ChevronDown className="w-4 h-4 rotate-90" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextCard();
          }}
          disabled={currentIndex === total - 1}
          aria-label="Next flashcard"
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-transform ${
            currentIndex === total - 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:scale-105"
          }`}
        >
          <ChevronDown className="w-4 h-4 -rotate-90" />
        </button>
      </div>

      {/* progress pill */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <div className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">{currentIndex + 1} / {total}</div>
        <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-2 bg-blue-500 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / total) * 100}%` }} />
        </div>
      </div>
    </div>
  );
});

FlashcardStack.displayName = "FlashcardStack";

const ChatbotMessages = memo(() => {
  const {setQuiz, setShowQuiz, setQuizId} = quizStore();
  const {setShowFlashcard, flashcards, setFlashcardTitle, setFlashcards} = flashcardStore();
  const token = Cookies.get("serviceToken");
  const agentName = useChatbotStore(useCallback((state) => state.agentName, []));
  const messages = useChatbotStore(useCallback((state) => state.messages, []));
  const sessionID = useChatbotStore(useCallback((state) => state.sessionID, []));
  const mode = useChatbotStore(useCallback((state) => state.mode, []));
  const setMode = useChatbotStore(useCallback((state) => state.setMode, []));
  const setMessages = useChatbotStore(useCallback((state) => state.setMessages, []));
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [showThinking, setShowThinking] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("AI is thinking...");
  const [thinkingMessageIndex, setThinkingMessageIndex] = useState(0);
  const {showToast, hideToast} = useToast();
  const [thinkingToastId, setThinkingToastId] = useState<string | null>(null);

  // Story modal state
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [storyJobId, setStoryJobId] = useState<string | null>(null);
  const [storyIntroMessage, setStoryIntroMessage] = useState<string | null>(null);
  const [storyTitle, setStoryTitle] = useState<string | null>(null);

  const thinkingMessages = [
    "Thinking...",
    "Analyzing your request...",
    "Processing information...",
    "Generating response...",
    "Almost ready...",
  ];

  const [selectedAttachment, setSelectedAttachment] = useState<{
    url: string;
    name: string;
    type: string;
  } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const {scrollTop, scrollHeight, clientHeight} = scrollContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
      setIsButtonVisible(!isNearBottom);
    }
  }, []);

  const openAttachmentPreview = useCallback(
    (attachment: {url: string; name: string; type: string}) => {
      setSelectedAttachment(attachment);
      setIsPreviewOpen(true);
    },
    [],
  );

  const closeAttachmentPreview = useCallback(() => {
    setIsPreviewOpen(false);
    setSelectedAttachment(null);
  }, []);

  const downloadAttachment = useCallback(() => {
    if (selectedAttachment) {
      const link = document.createElement("a");
      link.href = selectedAttachment.url;
      link.download = selectedAttachment.name;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [selectedAttachment]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Scroll to bottom whenever user message arrives
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role !== "PathAI") {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPreviewOpen) {
        closeAttachmentPreview();
      }
    };

    if (isPreviewOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isPreviewOpen, closeAttachmentPreview]);

  // Lock scrolling when story modal is open
  useEffect(() => {
    if (showStoryModal) {
      document.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape") setShowStoryModal(false);
      });
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showStoryModal]);

  const handleResponseChunk = useCallback(
    (data: any) => {
      setMessages((prev: any[]) => {
        const filteredPrev = prev.filter((msg: any) => msg.type !== "thinking");
        const lastIndex = filteredPrev.length - 1;
        const lastMessage = filteredPrev[lastIndex];

        if (lastMessage?.role === "PathAI") {
          // append new chunk
          if (!lastMessage.content.includes(data.chunk)) {
            const updatedMessage = {
              ...lastMessage,
              content: lastMessage.content + (data.chunk || ""),
            };

            // replace only the last PathAI message
            return [...filteredPrev.slice(0, lastIndex), updatedMessage];
          }
          return filteredPrev;
        }

        // if no PathAI message yet, create new one
        return [
          ...filteredPrev,
          {
            content: data.chunk || "",
            role: "PathAI",
            conversation_id: sessionID,
            category: "chat",
          },
        ];
      });
    },
    [sessionID, setMessages],
  );

  const handleQuizArtifactGenerated = useCallback(
    (data: any) => {
      const {intro_text, quiz_id, topic, quiz_data} = data;

      setQuizId(quiz_id);
      setQuiz(quiz_data.questions);

      const quizMessage = {
        content: intro_text,
        role: "PathAI",
        agentName: agentName,
        conversation_id: sessionID,
        category: "quiz",
        type: "quiz_artifact",
        quiz_id: quiz_id,
        topic: topic,
        quiz_data: quiz_data,
      };

      setMessages((prev: any[]) => {
        const filteredPrev = prev.filter((msg: any) => msg.type !== "thinking");
        return [...filteredPrev, quizMessage];
      });
    },
    [sessionID, setMessages, setQuizId, setQuiz],
  );

  const handleFlashcardGenerated = useCallback(
    (data: any) => {
      const {role, intro_text, flashcard_id, flashcard_data, topic} = data;
      const {flashcards, title, subject} = flashcard_data;
      setShowFlashcard(true);
      setFlashcards(flashcards);
      setFlashcardTitle(title);

      const flashcardMessage = {
        content: intro_text,
        role: role || "PathAI",
        conversation_id: sessionID,
        category: "flashcard",
        type: "flashcard_artifact",
        flashcard_id: flashcard_id,
        title: title,
        subject: subject,
        topic: topic,
        flashcards_data: flashcards,
      };

      setMessages((prev: any[]) => {
        const filteredPrev = prev.filter((msg: any) => msg.type !== "thinking");
        return [...filteredPrev, flashcardMessage];
      });
    },
    [sessionID, setMessages, setFlashcards, setFlashcardTitle, setShowFlashcard],
  );

  const handleThinkingStart = useCallback(() => {
    setThinkingMessageIndex(0);
    setCurrentMessage(thinkingMessages[0]);
    setShowThinking(true);

    if (!thinkingToastId) {
      const id = showToast({
        message: "PathAI is thinking...",
        status: "loading",
        duration: 0,
        position: "top-center",
        showClose: false,
      });
      setThinkingToastId(id);
    }

    const thinkingMessage = {
      content: thinkingMessages[0],
      role: "PathAI",
      conversation_id: sessionID,
      category: "chat",
      type: "thinking",
    };

    setMessages((prev: any[]) => {
      const filteredPrev = prev.filter((msg: any) => msg.type !== "thinking");
      return [...filteredPrev, thinkingMessage];
    });
  }, [sessionID, setMessages, thinkingMessages, showToast, thinkingToastId]);

  const handleThinkingEnd = useCallback(() => {
    setShowThinking(false);

    if (thinkingToastId) {
      hideToast(thinkingToastId);
      setThinkingToastId(null);
    }

    setMessages((prev: any[]) => {
      const filtered = prev.filter((msg: any) => msg.type !== "thinking");
      return filtered;
    });
  }, [setMessages, hideToast, thinkingToastId]);

  // Add this new helper function at the top level of your component
  const addMessageKeys = (messages: any[]) => {
    return messages.map((message) => ({
      ...message,
      key: `${message.role}-${Date.now()}-${Math.random()}`,
    }));
  };

  // Replace the existing handleGenerationComplete function
  const handleGenerationComplete = useCallback(() => {
    setMessages((prev: any[]) => {
      // Add unique keys to force re-render of all messages
      const messagesWithKeys = addMessageKeys(prev);

      // Update the last AI message specifically
      const lastIndex = messagesWithKeys.length - 1;
      if (lastIndex >= 0 && messagesWithKeys[lastIndex].role === "PathAI") {
        messagesWithKeys[lastIndex] = {
          ...messagesWithKeys[lastIndex],
          forceRender: true, // Add a flag to force markdown update
        };
      }

      return messagesWithKeys;
    });
  }, [setMessages]);

  function fixStreamingMarkdown(text: string) {
    const count = (text.match(/```/g) || []).length;
    if (count % 2 !== 0) return text + "\n```"; // temporary close code block
    return text;
  }
  const handleServerError = useCallback(
    (data: any) => {
      const messageText =
        typeof data === "string" ? data : data?.message || "An error occurred. Please try again.";
      const errorAlert = {
        conversation_id: sessionID,
        type: "alert",
        alertType: "error",
        category: "system",
        title: "Error",
        content: messageText,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      setMessages((prev: any[]) => {
        const filteredPrev = prev.filter((msg: any) => msg.type !== "thinking");
        return [...filteredPrev, errorAlert];
      });
    },
    [sessionID, setMessages],
  );

  /**
   * Handles real-time visualization status updates
   * Updates or creates status indicator messages for ongoing video generation
   */
  const handleVisualizationStatusUpdate = useCallback(
    (data: any) => {
      const {job_id, status, chat_id} = data;

      // Only process if this update is for the current chat
      if (chat_id !== sessionID) return;

      setMessages((prev: any[]) => {
        // Remove any existing thinking indicators
        const filteredPrev = prev.filter((msg: any) => msg.type !== "thinking");

        // Find existing status indicator for this job
        const existingIndex = filteredPrev.findIndex(
          (msg: any) => msg.job_id === job_id && msg.type === "video_status",
        );

        const statusMessage = {
          role: "PathAI",
          agentName: agentName,
          conversation_id: sessionID,
          category: "video",
          type: "video_status",
          job_id: job_id,
          video_status: status,
          content: `Video generation in progress...`, // This won't be displayed, just for completeness
        };

        if (existingIndex !== -1) {
          // Update existing status indicator
          const updated = [...filteredPrev];
          updated[existingIndex] = {...updated[existingIndex], video_status: status};
          return updated;
        } else {
          // Add new status indicator
          return [...filteredPrev, statusMessage];
        }
      });
    },
    [sessionID, setMessages, agentName],
  );

  /**
   * Handles storybook status updates (progress, current page, total pages)
   */
  const handleStorybookStatusUpdate = useCallback(
    (data: any) => {
      const {job_id, status, current_page, total_pages, chat_id, topic} = data;

      if (chat_id !== sessionID) {
        return;
      }
      
      setMessages((prev: any[]) => {
        const filteredPrev = prev.filter((msg: any) => msg.type !== "thinking");

        const existingIndex = filteredPrev.findIndex(
          (msg: any) => msg.job_id === job_id && msg.type === "storybook_status",
        );

        const statusMessage = {
          role: "PathAI",
          agentName: agentName,
          conversation_id: sessionID,
          category: "story",
          type: "storybook_status",
          job_id: job_id,
          story_status: status,
          current_page: current_page,
          total_pages: total_pages,
          topic: topic || "Story",
          content: `Storybook generation in progress...`, // Add content for consistency
        } as any;

        if (existingIndex !== -1) {
          const updated = [...filteredPrev];
          updated[existingIndex] = {...updated[existingIndex], ...statusMessage};
          return updated;
        } else {
          return [...filteredPrev, statusMessage];
        }
      });
    },
    [sessionID, setMessages, agentName],
  );

  /**
   * Handles real-time PPT status updates
   * Updates or creates status indicator messages for ongoing PPT generation
   */
  const handlePPTStatusUpdate = useCallback(
    (data: any) => {
      const {job_id, status, chat_id, topic, current_slide, total_slides, progress} = data;

      // Only process if this update is for the current chat
      if (chat_id !== sessionID) return;

      setMessages((prev: any[]) => {
        // Remove any existing thinking indicators
        const filteredPrev = prev.filter((msg: any) => msg.type !== "thinking");

        // If status is completed, create a PPT artifact message instead of status message
        if (status === "completed") {
          // Remove any existing status indicators for this job
          const withoutStatus = filteredPrev.filter(
            (msg: any) => !(msg.job_id === job_id && msg.type === "ppt_status"),
          );

          // Create final PPT artifact message
          const pptArtifactMessage = {
            role: "PathAI",
            agentName: agentName,
            conversation_id: sessionID,
            category: "ppt",
            type: "ppt_artifact",
            content: "Your PPT video is ready! Click play to watch your presentation.",
            job_id: job_id,
            topic: topic || "PPT",
            ppt_status: "completed",
          };

          return [...withoutStatus, pptArtifactMessage];
        }

        // For non-completed statuses, show status indicator
        // Find existing status indicator for this job
        const existingIndex = filteredPrev.findIndex(
          (msg: any) => msg.job_id === job_id && msg.type === "ppt_status",
        );

        const statusMessage = {
          role: "PathAI",
          agentName: agentName,
          conversation_id: sessionID,
          category: "ppt",
          type: "ppt_status",
          job_id: job_id,
          ppt_status: status,
          topic: topic,
          current_slide: current_slide,
          total_slides: total_slides,
          progress: progress,
          content: `PPT generation in progress...`, // This won't be displayed, just for completeness
        };

        if (existingIndex !== -1) {
          // Update existing status indicator
          const updated = [...filteredPrev];
          updated[existingIndex] = {
            ...updated[existingIndex], 
            ppt_status: status,
            current_slide: current_slide,
            total_slides: total_slides,
            progress: progress
          };
          return updated;
        } else {
          // Add new status indicator
          return [...filteredPrev, statusMessage];
        }
      });
    },
    [sessionID, setMessages, agentName],
  );

  /**
   * Handles final video artifact delivery
   * Replaces status indicator with final video player component
   */
  const handleVideoArtifactGenerated = useCallback(
    (data: any) => {
      const {role, message, job_id} = data;

      setMessages((prev: any[]) => {
        // Remove thinking indicators and status indicators for this job
        const filteredPrev = prev.filter(
          (msg: any) =>
            msg.type !== "thinking" && !(msg.job_id === job_id && msg.type === "video_status"),
        );

        // Create final video message
        const videoMessage = {
          role: role || "PathAI",
          agentName: agentName,
          conversation_id: sessionID,
          category: "video",
          type: "video_artifact",
          content: message || "Your video is ready!",
          job_id: job_id,
          video_status: "COMPLETE",
        };

        return [...filteredPrev, videoMessage];
      });
    },
    [sessionID, setMessages, agentName],
  );

  /**
   * Handles final PPT artifact delivery
   * Replaces status indicator with final PPT player component
   */
  const handlePPTArtifactGenerated = useCallback(
    (data: any) => {
      const {role, message, job_id, topic} = data;

      setMessages((prev: any[]) => {
        // Remove thinking indicators and status indicators for this job
        const filteredPrev = prev.filter(
          (msg: any) =>
            msg.type !== "thinking" && !(msg.job_id === job_id && msg.type === "ppt_status"),
        );

        // Create final PPT message
        const pptMessage = {
          role: role || "PathAI",
          agentName: agentName,
          conversation_id: sessionID,
          category: "ppt",
          type: "ppt_artifact",
          content: message || "Your PPT is ready!",
          job_id: job_id,
          topic: topic,
          ppt_status: "COMPLETE",
        };

        return [...filteredPrev, pptMessage];
      });
    },
    [sessionID, setMessages, agentName],
  );

  // Handler for storybook artifacts emitted by the backend
  const handleStorybookArtifactGenerated = useCallback(
    async (data: any) => {
      // Expected data: { role, message|intro_text, job_id|story_id, title, topic }

      const { role, intro_text, message: msg, story_id, job_id, title, topic } = data;

      const intro = intro_text || msg || null;
      const id = story_id || job_id || null;

      if (id) {
        // Open modal and let StoryBookComponent handle data fetching
        setStoryJobId(String(id));
        setStoryIntroMessage(intro);
        setStoryTitle(title || topic || null);
        setShowStoryModal(true);
      } else {
        // fallback: if no id provided, still append a notice message
        const fallback = {
          content: intro || "A storybook was generated (no id provided)",
          role: role || "PathAI",
          conversation_id: sessionID,
          category: "story",
          type: "story_artifact",
        };
        setMessages((prev: any[]) => {
          const filteredPrev = prev.filter((msg: any) => msg.type !== "thinking");
          return [...filteredPrev, fallback];
        });
      }
    },
    [sessionID, setMessages],
  );

  useEffect(() => {
    const handleReconnect = () => {
      socket.emit("join_room", {user_id: token, chat_id: sessionID});
    };

    socket.on(events.RECONNECT, handleReconnect);
    socket.on(events.PATHAI_CHUNK, handleResponseChunk);
    socket.on(events.QUIZ_ARTIFACT_GENERATED, handleQuizArtifactGenerated);
    socket.on(events.FLASHCARD_ARTIFACT_GENERATED, handleFlashcardGenerated);
    socket.on(events.THINKING_START, handleThinkingStart);
    socket.on(events.THINKING_END, handleThinkingEnd);
    socket.on(events.GENERATION_COMPLETE, handleGenerationComplete);
    socket.on(events.ERROR, handleServerError);
    // Video visualization pipeline events
    socket.on(events.VISUALIZATION_STATUS_UPDATE, handleVisualizationStatusUpdate);
    socket.on(events.VIDEO_ARTIFACT_GENERATED, handleVideoArtifactGenerated);
    socket.on(events.STORYBOOK_STATUS_UPDATE, handleStorybookStatusUpdate);
    // Storybook events: listen for a few possible event name variants to be robust
    socket.on(events.STORYBOOK_ARTIFACT_GENERATED, handleStorybookArtifactGenerated);
    // PPT generation pipeline events
    socket.on(events.PPT_STATUS_UPDATE, handlePPTStatusUpdate);
    socket.on(events.PPT_ARTIFACT_GENERATED, handlePPTArtifactGenerated);
    
    return () => {
      socket.off(events.RECONNECT, handleReconnect);
      socket.off(events.PATHAI_CHUNK, handleResponseChunk);
      socket.off(events.QUIZ_ARTIFACT_GENERATED, handleQuizArtifactGenerated);
      socket.off(events.FLASHCARD_ARTIFACT_GENERATED, handleFlashcardGenerated);
      socket.off(events.THINKING_START, handleThinkingStart);
      socket.off(events.THINKING_END, handleThinkingEnd);
      socket.off(events.GENERATION_COMPLETE, handleGenerationComplete);
      socket.off(events.ERROR, handleServerError);
      // Clean up video visualization pipeline events
      socket.off(events.VISUALIZATION_STATUS_UPDATE, handleVisualizationStatusUpdate);
      socket.off(events.VIDEO_ARTIFACT_GENERATED, handleVideoArtifactGenerated);
      // Clean up storybook events
      socket.off(events.STORYBOOK_STATUS_UPDATE, handleStorybookStatusUpdate);
      socket.off(events.STORYBOOK_ARTIFACT_GENERATED, handleStorybookArtifactGenerated);
      // Clean up PPT events
      socket.off(events.PPT_STATUS_UPDATE, handlePPTStatusUpdate);
      socket.off(events.PPT_ARTIFACT_GENERATED, handlePPTArtifactGenerated);
    };
  }, [
    sessionID,
    token,
    handleResponseChunk,
    handleQuizArtifactGenerated,
    handleFlashcardGenerated,
    handleThinkingStart,
    handleThinkingEnd,
    handleGenerationComplete,
    handleServerError,
    handleVisualizationStatusUpdate,
    handleVideoArtifactGenerated,
    handleStorybookArtifactGenerated,
    handleStorybookStatusUpdate,
    handlePPTStatusUpdate,
    handlePPTArtifactGenerated,
  ]);

  if (mode === "quiz") return null;

  useEffect(() => {
    if (!showThinking) return;

    const interval = setInterval(() => {
      setThinkingMessageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % thinkingMessages.length;
        setCurrentMessage(thinkingMessages[nextIndex]);
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [showThinking, thinkingMessages]);

  useEffect(() => {
    if (!showThinking) return;

    setMessages((prev: any[]) => {
      return prev.map((msg: any) =>
        msg.type === "thinking" ? {...msg, content: currentMessage} : msg,
      );
    });
  }, [currentMessage, showThinking, setMessages]);

  return (
    <>
      <div
        className="flex-1 py-8 lg:px-8 xl:px-4 space-y-6 mx-auto w-full md:w-[39rem] lg:w-[55rem] scroll-container"
        ref={scrollContainerRef}
      >
        {messages.map((message: any, index: number) => {
          if (!message) {
            return null;
          }

          // Allow status messages without content
          if (typeof message.content === "undefined" && !["video_status", "storybook_status", "ppt_status"].includes(message.type)) {
            return null;
          }

          if (message.type === "alert") {
            return (
              <div key={index}>
                <ChatAlert
                  type={message.alertType}
                  title={message.title}
                  message={message.content}
                  score={message.score}
                />
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`flex ${message.role !== "PathAI" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`inline-block rounded-xl break-words overflow-x-scroll scroll-container p-1 ${
                  message.role !== "PathAI"
                    ? "text-light-light-black max-w-2xl lg:max-w-xl"
                    : "text-light-light-black w-full"
                }`}
              >
                {message.role !== "PathAI" ? (
                  <>
                    <div className="flex flex-row justify-end gap-2 max-w-lg mb-2">
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex flex-row gap-2 mt-3">
                          {message.attachments.map((attachment: any, i: number) =>
                            attachment.type.startsWith("image/") ? (
                              <div
                                key={i}
                                className="w-full h-full max-h-56 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => openAttachmentPreview(attachment)}
                              >
                                <Image
                                  src={attachment.url}
                                  alt={attachment.name}
                                  width={1000}
                                  height={1000}
                                  className="w-full h-full max-h-56 object-cover rounded-lg"
                                />
                              </div>
                            ) : (
                              <div
                                key={i}
                                className="w-full h-20 p-3 flex flex-col gap-2 items-center justify-center rounded-lg bg-logo-primary/10 border border-logo-primary/20 cursor-pointer hover:bg-logo-primary/20 transition-colors"
                                onClick={() => openAttachmentPreview(attachment)}
                              >
                                <FileIcon className="w-8 h-8 text-logo-primary/50" />
                                <p className="text-xs text-logo-primary/80">{attachment.name}</p>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                    {message.content?.trim() ? (
                      <div className="grid items-center group gap-2 justify-end">
                        <div className="whitespace-pre-wrap py-2 px-4 lg:p-4 rounded-2xl rounded-br-sm bg-[#E6EFFF] border border-text-blue/20 font-poppins">
                          <HighlightedMessage
                            content={message.content}
                            attachments={message.attachments}
                          />
                        </div>
                        <div className="flex justify-end group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                          <CopyButton selection={message.content} />
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="flex items-start max-w-full">
                    {message.type === "thinking" ? (
                      <div className="flex items-start space-x-4 py-1.5">
                        <div className="flex-shrink-0">
                          <div className="relative"></div>
                        </div>
                        <div className="pt-2">
                          <div className="text-md animate-pulse text-shimmer-gray flex items-center">
                            <span
                              key={thinkingMessageIndex}
                              className="animate-in fade-in duration-500"
                            >
                              {currentMessage}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : message.type === "quiz_artifact" ? (
                      <>
                        <div className="flex-shrink-0">
                          <div className="relative"></div>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="group w-full">
                            {message.content && (
                              <div className="py-1.5">
                                <div className="prose prose-sm max-w-none">
                                  <CustomMarkdown
                                    key={message.role !== "user" ? message.content : index}
                                    content={fixStreamingMarkdown(message.content)}
                                  />
                                </div>
                              </div>
                            )}
                            <div className="mt-4 w-full p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-blue-900">
                                    Quiz: {message.topic}
                                  </h4>
                                  <p className="text-sm text-blue-700">
                                    {message.quiz_data?.questions?.length || 0} questions
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    setShowQuiz();
                                    setMode("quiz");
                                  }}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                  Start Quiz
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center mt-3 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="flex items-center space-x-1 p-1">
                                <div className="p-1 rounded-full transition-colors">
                                  <CopyButton selection={message.content} />
                                </div>
                                <div className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                                  <ThumbsUp />
                                </div>
                                <div className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                                  <ThumbsDown />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : message.type === "flashcard_artifact" ? (
                      // Final flashcard component
                      <>
                        <div className="flex-shrink-0">
                          <div className="relative"></div>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="group w-full">
                            {message.content && (
                              <div className="py-1.5">
                                <div className="prose prose-sm max-w-none">
                                  <CustomMarkdown
                                    key={message.role !== "user" ? message.content : index}
                                    content={fixStreamingMarkdown(message.content)}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Flashcard Stack Component */}
                            <FlashcardStack
                              flashcards={message.flashcards_data || []}
                              title={message.title || "Flashcards"}
                            />

                            <div className="flex items-center mt-3 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="flex items-center space-x-1 p-1">
                                <div className="p-1 rounded-full transition-colors">
                                  <CopyButton selection={message.content} />
                                </div>
                                <div className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                                  <ThumbsUp />
                                </div>
                                <div className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                                  <ThumbsDown />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : message.type === "video_status" ? (
                      // Video generation status indicator
                      <>
                        <div className="flex-shrink-0">
                          <div className="relative"></div>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="group w-full">
                            <div className="py-1.5">
                              <VideoStatusIndicator
                                jobId={message.job_id || "unknown"}
                                status={message.video_status || "SCRIPTING"}
                                topic={message.topic}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : message.type === "video_artifact" ? (
                      // Final video player component
                      <>
                        <div className="flex-shrink-0">
                          <div className="relative"></div>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="group w-full">
                            {message.content && (
                              <div className="py-1.5">
                                <div className="prose prose-sm max-w-none">
                                  <CustomMarkdown
                                    key={message.role !== "user" ? message.content : index}
                                    content={fixStreamingMarkdown(message.content)}
                                  />
                                </div>
                              </div>
                            )}
                            <div className="mt-4 w-full">
                              <VideoPlayerComponent
                                jobId={message.job_id || "unknown"}
                                topic={message.topic || "Video"}
                                message={
                                  typeof message.content === "string" ? message.content : undefined
                                }
                              />
                            </div>
                            <div className="flex items-center mt-3 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="flex items-center space-x-1 p-1">
                                <div className="p-1 rounded-full transition-colors">
                                  <CopyButton selection={message.content} />
                                </div>
                                <div className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                                  <ThumbsUp />
                                </div>
                                <div className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                                  <ThumbsDown />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : message.type === "ppt_status" ? (
                      // PPT generation status indicator
                      <>
                        <div className="flex-shrink-0">
                          <div className="relative"></div>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="group w-full">
                            <div className="py-1.5">
                              <PPTStatusIndicator
                                jobId={message.job_id || "unknown"}
                                status={message.ppt_status || "pending"}
                                topic={message.topic}
                                currentSlide={message.current_slide}
                                totalSlides={message.total_slides}
                                progress={message.progress}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : message.type === "ppt_artifact" ? (
                      // Final PPT player component
                      <>
                        <div className="flex-shrink-0">
                          <div className="relative"></div>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="group w-full">
                            {message.content && (
                              <div className="py-1.5">
                                <div className="prose prose-sm max-w-none">
                                  <CustomMarkdown
                                    key={message.role !== "user" ? message.content : index}
                                    content={fixStreamingMarkdown(message.content)}
                                  />
                                </div>
                              </div>
                            )}
                            <div className="mt-4 w-full">
                              <PPTPlayerComponent
                                jobId={message.job_id || "unknown"}
                                topic={message.topic || "PPT"}
                                message={
                                  typeof message.content === "string" ? message.content : undefined
                                }
                              />
                            </div>
                            <div className="flex items-center mt-3 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="flex items-center space-x-1 p-1">
                                <div className="p-1 rounded-full transition-colors">
                                  <CopyButton selection={message.content} />
                                </div>
                                <div className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                                  <ThumbsUp />
                                </div>
                                <div className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                                  <ThumbsDown />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : message.type === "story_artifact" ? (
                      // Story viewer component
                      <>
                        <div className="flex-shrink-0">
                          <div className="relative"></div>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="group w-full">
                            {message.content && (
                              <div className="py-1.5">
                                <div className="prose prose-sm max-w-none">
                                  <CustomMarkdown
                                    key={message.role !== "user" ? message.content : index}
                                    content={fixStreamingMarkdown(message.content)}
                                  />
                                </div>
                              </div>
                            )}
                            <div className="mt-4 w-full">
                              <StoryBookComponent
                                jobId={message.job_id || message.story_id || "unknown"}
                                topic={message.topic || "Story"}
                              />
                            </div>
                            <div className="flex items-center mt-3 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="flex items-center space-x-1 p-1">
                                <div className="p-1 rounded-full transition-colors">
                                  <CopyButton selection={message.content} />
                                </div>
                                <div className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                                  <ThumbsUp />
                                </div>
                                <div className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                                  <ThumbsDown />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : message.type === "storybook_status" ? (
                      <>
                        <div className="flex-shrink-0">
                          <div className="relative"></div>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="group w-full">
                            <div className="py-1.5">
                              <StoryBookStatus
                                jobId={message.job_id}
                                status={message.story_status}
                                topic={message.topic}
                                currentPage={message.current_page}
                                totalPages={message.total_pages}
                                onViewClick={() => {
                                  // Open modal and let StoryBookComponent handle data fetching
                                  setStoryJobId(String(message.job_id));
                                  setStoryTitle(message.topic || "Story");
                                  setStoryIntroMessage("Your storybook is ready!");
                                  setShowStoryModal(true);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-shrink-0">
                          <div className="relative"></div>
                        </div>
                        <div className="flex-1 min-w-0 max-w-3xl">
                          <div className="group">
                            {message.content && (
                              <div className="py-1.5">
                                <div className="prose prose-sm max-w-none">
                                  {/* add message stream here */}
                                  <Streamdown children={message.content} />
                                  {/* <CustomMarkdown
                                    key={message.role !== "user" ? message.content : index}
                                    content={fixStreamingMarkdown(message.content)}
                                  /> */}
                                </div>
                              </div>
                            )}
                            {message.visualization && (
                              <div className="mt-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <video
                                  controls
                                  className="w-full rounded-lg"
                                  src={`/api/visualize/${message.visualization}`}
                                >
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            )}
                            <div className="flex items-center mt-3 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="flex items-center space-x-1 p-1">
                                <div className="p-1  rounded-full transition-colors">
                                  <CopyButton selection={message.content} />
                                </div>
                                <div className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                                  <ThumbsUp />
                                </div>
                                <div className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                                  <ThumbsDown />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {isButtonVisible && (
        <button
          className="fixed bottom-40 left-3/4 -translate-x-1/2 w-fit right-8 p-2 bg-dark-logo-primary rounded-full shadow-lg  transition-colors"
          onClick={scrollToBottom}
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </button>
      )}

      {isPreviewOpen && selectedAttachment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeAttachmentPreview}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeAttachmentPreview}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button
                onClick={() => window.open(selectedAttachment.url, "_blank")}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 px-4 py-2 rounded-lg text-white text-sm">
              {selectedAttachment.name}
            </div>
            <div className="w-full h-full flex items-center justify-center">
              {selectedAttachment.type.startsWith("image/") ? (
                <Image
                  src={selectedAttachment.url}
                  alt={selectedAttachment.name}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  unoptimized
                />
              ) : selectedAttachment.type === "application/pdf" ? (
                <div className="w-full h-full bg-white rounded-lg overflow-hidden">
                  <iframe
                    src={selectedAttachment.url}
                    className="w-full h-full"
                    title={selectedAttachment.name}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 text-white">
                  <FileIcon className="w-24 h-24 text-white/70" />
                  <h3 className="text-xl font-semibold">{selectedAttachment.name}</h3>
                  <p className="text-white/70">Preview not available for this file type</p>
                  <button
                    onClick={downloadAttachment}
                    className="px-6 py-3 bg-logo-primary hover:bg-logo-primary/80 rounded-lg text-white font-medium transition-colors"
                  >
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Storybook modal (opened from socket event) */}
      <StoryBookComponent
        jobId={storyJobId || ""}
        topic={storyTitle || "Story"}
        isOpen={showStoryModal}
        onClose={() => {
          setShowStoryModal(false);
          setStoryJobId(null);
          setStoryIntroMessage(null);
          setStoryTitle(null);
        }}
      />
    </>
  );
});

ChatbotMessages.displayName = "ChatbotMessages";

export default ChatbotMessages;
