"use client";
import React, {useState, useEffect, useCallback} from "react";
import {
  ChevronDown,
  FileVideo,
  Video,
  BookOpen,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {socket} from "@/lib/socketClient";
import {events} from "@/data/socket/constants";
import {useChatbotStore} from "../../store/chatbotStore";

interface ActiveProcess {
  id: string;
  type: "ppt" | "video" | "storybook";
  topic: string;
  status: string;
  progress?: number;
  currentSlide?: number;
  totalSlides?: number;
  currentPage?: number;
  totalPages?: number;
  chatId: string;
}

const PersistentStatusIndicator: React.FC = () => {
  const [activeProcesses, setActiveProcesses] = useState<ActiveProcess[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const sessionID = useChatbotStore(useCallback((state) => state.sessionID, []));

  // Helper function to scroll to process message in chat
  const scrollToProcessMessage = useCallback((processId: string, processType: string) => {
    // Find the message element by looking for data attributes or specific content
    const messageElements = document.querySelectorAll('[class*="message"], [class*="status"]');

    for (const element of messageElements) {
      // Look for job_id in text content or data attributes
      if (
        element.textContent?.includes(processId) ||
        element.getAttribute("data-job-id") === processId
      ) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Add a brief highlight effect
        element.classList.add("bg-yellow-100");
        setTimeout(() => {
          element.classList.remove("bg-yellow-100");
        }, 2000);
        break;
      }
    }
  }, []);

  // Helper function to get process icon
  const getProcessIcon = (type: string, status: string) => {
    const iconClass = "w-5 h-5";

    if (status === "completed" || status === "COMPLETE") {
      return <CheckCircle className={`${iconClass} text-green-600`} />;
    }

    if (status === "error" || status === "failed") {
      return <AlertCircle className={`${iconClass} text-red-600`} />;
    }

    switch (type) {
      case "ppt":
        return <FileVideo className={`${iconClass} text-blue-600`} />;
      case "video":
        return <Video className={`${iconClass} text-purple-600`} />;
      case "storybook":
        return <BookOpen className={`${iconClass} text-green-600`} />;
      default:
        return <Loader2 className={`${iconClass} text-gray-600 animate-spin`} />;
    }
  };

  // Helper function to get progress color
  const getProgressColor = (type: string, status: string) => {
    if (status === "completed" || status === "COMPLETE") return "bg-green-500";
    if (status === "error" || status === "failed") return "bg-red-500";

    switch (type) {
      case "ppt":
        return "bg-blue-500";
      case "video":
        return "bg-purple-500";
      case "storybook":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Helper function to format status text
  const getStatusText = (process: ActiveProcess) => {
    const {type, status, currentSlide, totalSlides, currentPage, totalPages, progress} = process;

    if (status === "completed" || status === "COMPLETE") {
      return "Completed";
    }

    if (status === "error" || status === "failed") {
      return "Failed";
    }

    switch (type) {
      case "ppt":
        if (currentSlide && totalSlides) {
          return `Slide ${currentSlide}/${totalSlides}`;
        }
        return progress ? `${Math.round(progress)}%` : "Generating...";

      case "video":
        return status === "SCRIPTING"
          ? "Creating script..."
          : status === "GENERATING"
            ? "Generating video..."
            : status === "PROCESSING"
              ? "Processing..."
              : "Generating...";

      case "storybook":
        if (currentPage && totalPages) {
          return `Page ${currentPage}/${totalPages}`;
        }
        return "Creating story...";

      default:
        return "Processing...";
    }
  };

  // Helper function to calculate progress percentage
  const getProgressPercentage = (process: ActiveProcess) => {
    const {type, progress, currentSlide, totalSlides, currentPage, totalPages, status} = process;

    if (status === "completed" || status === "COMPLETE") return 100;
    if (status === "error" || status === "failed") return 0;

    if (progress) return Math.min(progress, 100);

    if (currentSlide && totalSlides) {
      return Math.min((currentSlide / totalSlides) * 100, 100);
    }

    if (currentPage && totalPages) {
      return Math.min((currentPage / totalPages) * 100, 100);
    }

    return 15; // Default progress for active processes
  };

  // Handler for PPT status updates
  const handlePPTStatusUpdate = useCallback(
    (data: any) => {
      const {job_id, status, chat_id, topic, current_slide, total_slides, progress} = data;

      if (chat_id !== sessionID) return;

      setActiveProcesses((prev) => {
        // Find existing process by job_id (regardless of type)
        const existingIndex = prev.findIndex((p) => p.id === job_id);

        // If completed, mark as completed and remove after delay
        if (status === "completed" || status === "COMPLETE") {
          if (existingIndex !== -1) {
            // Mark as completed first
            const updated = [...prev];
            updated[existingIndex] = {...updated[existingIndex], status: "completed"};

            // Remove after showing completion
            setTimeout(() => {
              setActiveProcesses((current) => current.filter((p) => p.id !== job_id));
            }, 2000);

            return updated;
          }
          return prev;
        }

        // Only add/update if not completed
        const newProcess: ActiveProcess = {
          id: job_id,
          type: "ppt",
          topic: topic || "PPT",
          status,
          progress,
          currentSlide: current_slide,
          totalSlides: total_slides,
          chatId: chat_id,
        };

        if (existingIndex !== -1) {
          // Update existing process
          const updated = [...prev];
          updated[existingIndex] = newProcess;

          return updated;
        } else {
          // Add new process

          return [...prev, newProcess];
        }
      });
    },
    [sessionID],
  );

  // Handler for video status updates
  const handleVideoStatusUpdate = useCallback(
    (data: any) => {
      const {job_id, status, chat_id, topic} = data;

      if (chat_id !== sessionID) return;

      setActiveProcesses((prev) => {
        // Find existing process by job_id (regardless of type)
        const existingIndex = prev.findIndex((p) => p.id === job_id);

        // If completed, mark as completed and remove after delay
        if (status === "COMPLETE" || status === "completed") {
          if (existingIndex !== -1) {
            // Mark as completed first
            const updated = [...prev];
            updated[existingIndex] = {...updated[existingIndex], status: "completed"};

            // Remove after showing completion
            setTimeout(() => {
              setActiveProcesses((current) => current.filter((p) => p.id !== job_id));
            }, 2000);

            return updated;
          }
          return prev;
        }

        // Only add/update if not completed
        const newProcess: ActiveProcess = {
          id: job_id,
          type: "video",
          topic: topic || "Video",
          status,
          chatId: chat_id,
        };

        if (existingIndex !== -1) {
          // Update existing process
          const updated = [...prev];
          updated[existingIndex] = newProcess;
          return updated;
        } else {
          // Add new process
          return [...prev, newProcess];
        }
      });
    },
    [sessionID],
  );

  // Handler for storybook status updates
  const handleStorybookStatusUpdate = useCallback(
    (data: any) => {
      const {job_id, status, chat_id, topic, current_page, total_pages} = data;

      if (chat_id !== sessionID) return;

      setActiveProcesses((prev) => {
        // Find existing process by job_id (regardless of type)
        const existingIndex = prev.findIndex((p) => p.id === job_id);

        // If completed, mark as completed and remove after delay
        if (status === "completed" || status === "COMPLETE") {
          if (existingIndex !== -1) {
            // Mark as completed first
            const updated = [...prev];
            updated[existingIndex] = {...updated[existingIndex], status: "completed"};

            // Remove after showing completion
            setTimeout(() => {
              setActiveProcesses((current) => current.filter((p) => p.id !== job_id));
            }, 2000);

            return updated;
          }
          return prev;
        }

        // Only add/update if not completed
        const newProcess: ActiveProcess = {
          id: job_id,
          type: "storybook",
          topic: topic || "Story",
          status,
          currentPage: current_page,
          totalPages: total_pages,
          chatId: chat_id,
        };

        if (existingIndex !== -1) {
          // Update existing process
          const updated = [...prev];
          updated[existingIndex] = newProcess;

          return updated;
        } else {
          // Add new process

          return [...prev, newProcess];
        }
      });
    },
    [sessionID],
  );

  // Handler for artifact generation (remove from active processes with delay)
  const handleArtifactGenerated = useCallback((data: any) => {
    const {job_id, story_id} = data;

    // Handle both job_id and story_id (for different event types)
    const processId = job_id || story_id;

    if (processId) {
      // First, mark as completed to show completion status
      setActiveProcesses((prev) => {
        const updated = prev.map((p) => (p.id === processId ? {...p, status: "completed"} : p));

        return updated;
      });

      // Then remove after a short delay to show completion
      setTimeout(() => {
        setActiveProcesses((prev) => {
          return prev.filter((p) => p.id !== processId);
        });
      }, 2000); // Show completion for 2 seconds
    }
  }, []);

  // Set up socket listeners
  useEffect(() => {
    socket.on(events.PPT_STATUS_UPDATE, handlePPTStatusUpdate);
    socket.on(events.PPT_ARTIFACT_GENERATED, handleArtifactGenerated);
    socket.on(events.VISUALIZATION_STATUS_UPDATE, handleVideoStatusUpdate);
    socket.on(events.VIDEO_ARTIFACT_GENERATED, handleArtifactGenerated);
    socket.on(events.STORYBOOK_STATUS_UPDATE, handleStorybookStatusUpdate);
    socket.on(events.STORYBOOK_ARTIFACT_GENERATED, handleArtifactGenerated);

    return () => {
      socket.off(events.PPT_STATUS_UPDATE, handlePPTStatusUpdate);
      socket.off(events.PPT_ARTIFACT_GENERATED, handleArtifactGenerated);
      socket.off(events.VISUALIZATION_STATUS_UPDATE, handleVideoStatusUpdate);
      socket.off(events.VIDEO_ARTIFACT_GENERATED, handleArtifactGenerated);
      socket.off(events.STORYBOOK_STATUS_UPDATE, handleStorybookStatusUpdate);
      socket.off(events.STORYBOOK_ARTIFACT_GENERATED, handleArtifactGenerated);
    };
  }, [
    handlePPTStatusUpdate,
    handleVideoStatusUpdate,
    handleStorybookStatusUpdate,
    handleArtifactGenerated,
  ]);

  // Auto-expand when new process starts and switch to compact mode for multiple processes
  useEffect(() => {
    if (activeProcesses.length > 0) {
      setIsExpanded(true);
      setCompactMode(activeProcesses.length > 2);
    } else {
      setCompactMode(false);
      setIsExpanded(false); // Auto-hide when no processes
    }
  }, [activeProcesses.length]);

  // Auto-cleanup processes older than 10 minutes (in case of missed completion events)
  useEffect(() => {
    const cleanup = setInterval(() => {
      setActiveProcesses((prev) => {
        // Remove processes that have been in error state or completed
        return prev.filter((process) => {
          if (
            process.status === "error" ||
            process.status === "failed" ||
            process.status === "completed" ||
            process.status === "COMPLETE"
          ) {
            return false;
          }
          return true;
        });
      });
    }, 60000); // Check every minute

    return () => clearInterval(cleanup);
  }, []);

  // Don't render if no active processes
  if (activeProcesses.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 transform -translate-y-1/2 z-40">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed state - just a small indicator
          <motion.div
            key="collapsed"
            initial={{scale: 0, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            exit={{scale: 0, opacity: 0}}
            transition={{duration: 0.2}}
            className="relative cursor-pointer"
            onClick={() => setIsExpanded(true)}
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-shadow">
              {/* Main icon showing the most recent process */}
              {activeProcesses.length > 0 &&
                getProcessIcon(activeProcesses[0].type, activeProcesses[0].status)}

              {/* Process count badge */}
              {activeProcesses.length > 1 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {activeProcesses.length}
                </div>
              )}

              {/* Animated progress ring for the most recent process */}
              {activeProcesses.length > 0 && (
                <svg
                  className="absolute inset-0 w-12 h-12 transform -rotate-90"
                  viewBox="0 0 48 48"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-200"
                  />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    className={getProgressColor(
                      activeProcesses[0].type,
                      activeProcesses[0].status,
                    ).replace("bg-", "text-")}
                    initial={{strokeDasharray: "0 125.6"}}
                    animate={{
                      strokeDasharray: `${(getProgressPercentage(activeProcesses[0]) / 100) * 125.6} 125.6`,
                    }}
                    transition={{duration: 0.5, ease: "easeOut"}}
                  />
                </svg>
              )}
            </div>
          </motion.div>
        ) : (
          // Expanded state - full panel
          <motion.div
            key="expanded"
            initial={{x: 100, opacity: 0, scale: 0.95}}
            animate={{x: 0, opacity: 1, scale: 1}}
            exit={{x: 100, opacity: 0, scale: 0.95}}
            transition={{duration: 0.3, ease: "easeOut"}}
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div
              className="p-3 bg-gray-50 border-b border-gray-200 cursor-pointer flex items-center justify-between min-w-[250px]"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {activeProcesses.length} Active Process{activeProcesses.length !== 1 ? "es" : ""}
                </span>
              </div>
              <motion.div animate={{rotate: 180}} transition={{duration: 0.2}}>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </motion.div>
            </div>

            {/* Process List */}
            <motion.div
              initial={{height: 0}}
              animate={{height: "auto"}}
              exit={{height: 0}}
              transition={{duration: 0.2}}
              className="overflow-hidden"
            >
              <div className="max-h-80 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {activeProcesses.map((process) => (
                    <motion.div
                      key={`${process.type}-${process.id}`}
                      initial={{opacity: 0, y: -10}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, x: 20, scale: 0.95}}
                      transition={{duration: 0.3}}
                      className={`border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                        compactMode ? "p-2" : "p-3"
                      } ${process.status === "completed" ? "bg-green-50" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {getProcessIcon(process.type, process.status)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4
                              className={`font-medium text-gray-900 truncate ${
                                compactMode ? "text-xs" : "text-sm"
                              }`}
                            >
                              {process.topic}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                scrollToProcessMessage(process.id, process.type);
                              }}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                              title="Find in chat"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          </div>

                          <p
                            className={`text-gray-600 ${compactMode ? "text-xs mb-1" : "text-xs mb-2"}`}
                          >
                            {getStatusText(process)}
                          </p>

                          {/* Progress Bar */}
                          <div
                            className={`w-full bg-gray-200 rounded-full ${compactMode ? "h-1" : "h-1.5"}`}
                          >
                            <motion.div
                              className={`${compactMode ? "h-1" : "h-1.5"} rounded-full ${getProgressColor(process.type, process.status)}`}
                              initial={{width: 0}}
                              animate={{width: `${getProgressPercentage(process)}%`}}
                              transition={{duration: 0.5, ease: "easeOut"}}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersistentStatusIndicator;
