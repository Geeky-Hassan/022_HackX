"use client";
import {useRef, useEffect, useCallback, useState} from "react";
import {useSearchParams} from "next/navigation";
import {HighlightPopover} from "@omsimos/react-highlight-popover";
import ChatbotMessages from "./Messages";
import {useChatbotStore} from "../../store/chatbotStore";
import {oneChabotMessage} from "../../components/global/constants";
import {ChatbotMessageType} from "@/types";
import {getChatHistory} from "@/services/llmChat";
import ChatbotInputField from "./ChatbotInputField";
import NewChat from "./NewChat";
import {useToast} from "../../components/Toast";
import Loader from "../../components/Loaders/Loader";
import WordMeaningPopover from "./Popover";
import {ALLOWED_FILE_TYPES, ALLOWED_MIME_TYPES} from "@/data/constants";
import InlineQuiz from "../../components/Quiz/InlineQuiz";
import dropFolder from "@/assets/images/dropFolder.svg";
import Image from "next/image";
import PersistentStatusIndicator from "./statusIndicator";

const ChatBotChat = () => {
  const {
    newChat,
    fetchChat,
    messages,
    sessionID,
    mode,
    setMessages,
    setSessionID,
    setFetchChat,
    setNewChat,
  } = useChatbotStore();
  const {showToast} = useToast();
  const [socketConnected, setSocketConnected] = useState(true);
  const [timer, setTimer] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();

  // Ref for ChatbotInputField to control focus
  const chatInputRef = useRef<{focus: () => void}>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  // File validation function
  const validateDroppedFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      const isValidType =
        ALLOWED_FILE_TYPES.includes(fileExtension) && ALLOWED_MIME_TYPES.includes(file.type);

      if (isValidType) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      showToast({
        message: `Unsupported file type(s): ${invalidFiles.join(", ")}. Only JPG, PNG, PDF, and DOCX files are allowed.`,
        status: "error",
        duration: 4000,
      });
    }

    return validFiles;
  };

  // Drag and drop event handlers
  const handleDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (mode === "quiz") return; // Don't allow drag in quiz mode

      setDragCounter((prev) => prev + 1);

      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    },
    [mode],
  );

  const handleDragLeave = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setDragCounter((prev) => prev - 1);

      if (dragCounter <= 1) {
        setIsDragging(false);
      }
    },
    [dragCounter],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(false);
      setDragCounter(0);

      if (mode === "quiz") {
        showToast({
          message: "File uploads are not allowed in quiz mode",
          status: "error",
          duration: 3000,
        });
        return;
      }

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const validFiles = validateDroppedFiles(files);

        if (validFiles.length > 0) {
          // Trigger file upload by dispatching a custom event
          // The ChatbotInput component will listen for this event
          const fileEvent = new CustomEvent("dragDropFiles", {
            detail: {files: validFiles},
          });
          window.dispatchEvent(fileEvent);

          showToast({
            message: `${validFiles.length} file(s) ready to upload`,
            status: "success",
            duration: 3000,
            position: "above-chatbot-input",
          });
        }
      }
    },
    [mode, validateDroppedFiles],
  );

  // Fetching chat  here
  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      if (!sessionID) {
        return;
      }

      const resp = await getChatHistory(sessionID);
      setMessages([...resp.messages]);
    } catch (error) {
      console.error(`Error fetching chat history: ${error}`);
      const message: ChatbotMessageType = oneChabotMessage({
        newChat,
        conversation_id: sessionID,
        role: "PathAI",
        category: "chat",
        content:
          "The chatbot got chills🥶 while fetching your chats! Please try refreshing the page or Create a New Chat!",
      }) as ChatbotMessageType;
      setMessages([message]);
    } finally {
      setLoading(false);
    }
  }, [sessionID, newChat, setMessages]);

  useEffect(() => {
    if (fetchChat) {
      // Function call here: Fetching chat history
      fetchChats();
    }
  }, [newChat, fetchChat, fetchChats]);

  // Auto-focus input after chat loads or navigation
  useEffect(() => {
    if (sessionID && !loading && mode !== "quiz") {
      // Small delay to ensure the input is rendered
      const timer = setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [sessionID, loading, mode, fetchChat]);

  // Focus on new chat creation
  useEffect(() => {
    if (newChat && mode !== "quiz") {
      const timer = setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [newChat, mode]);

  // Handle "/" key to focus input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only focus if "/" is pressed and we're not already focused on an input/textarea
      if (
        event.key === "/" &&
        mode !== "quiz" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        !(document.activeElement as HTMLElement)?.isContentEditable
      ) {
        event.preventDefault();
        chatInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mode]);

  // Handle opening a chat from sidebar via query param
  useEffect(() => {
    const chatId = searchParams.get("chat");
    if (chatId && chatId !== sessionID) {
      setSessionID(chatId);
      setNewChat(false);
      setFetchChat(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // --- Timer Logic (same as before) ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (refresh && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer <= 0) {
      setRefresh(false); // Enable refresh button when timer hits 0
      setTimer(0); // Ensure timer is 0
      if (interval) {
        clearInterval(interval);
      }
    }
    // Cleanup interval on component unmount or when conditions change
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [refresh, timer]); // Rerun effect when refresh or timer changes

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Disable scrolling during quiz mode
  useEffect(() => {
    if (mode === "quiz") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mode]);

  // Handle escape key and click outside to close drag overlay
  const closeDragOverlay = useCallback(() => {
    setIsDragging(false);
    setDragCounter(0);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDragging) {
        closeDragOverlay();
      }
    },
    [isDragging, closeDragOverlay],
  );

  const handleWindowBlur = useCallback(() => {
    if (isDragging) {
      closeDragOverlay();
    }
  }, [isDragging, closeDragOverlay]);

  // Set up drag and drop event listeners
  useEffect(() => {
    const handleDragEnterTyped = (e: DragEvent) => handleDragEnter(e);
    const handleDragLeaveTyped = (e: DragEvent) => handleDragLeave(e);
    const handleDragOverTyped = (e: DragEvent) => handleDragOver(e);
    const handleDropTyped = (e: DragEvent) => handleDrop(e);

    document.addEventListener("dragenter", handleDragEnterTyped);
    document.addEventListener("dragleave", handleDragLeaveTyped);
    document.addEventListener("dragover", handleDragOverTyped);
    document.addEventListener("drop", handleDropTyped);

    // Add escape key listener
    document.addEventListener("keydown", handleKeyDown);

    // Add window blur listener to handle cases where user drags outside window
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("dragenter", handleDragEnterTyped);
      document.removeEventListener("dragleave", handleDragLeaveTyped);
      document.removeEventListener("dragover", handleDragOverTyped);
      document.removeEventListener("drop", handleDropTyped);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleKeyDown,
    handleWindowBlur,
  ]);

  return (
    <div className="mx-auto w-full px-3 md:pr-4 md:px-4 pt-10">
      {/* Drag and Drop Overlay */}
      {isDragging && (
        <div
          className="fixed inset-0 z-50 w-full mx-auto flex items-center justify-center bg-black/30 backdrop-blur-xs cursor-pointer"
          onClick={closeDragOverlay}
        >
          <div
            className="rounded-2xl p-12 m-8 flex flex-col items-center justify-center text-center max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the drop zone itself
          >
            <Image src={dropFolder} alt="dropFolder" className="w-20 h-20 text-logo-primary mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Drop your files here</h3>
            <p className="text-white text-md">Supports JPG, PNG, and PDF files</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-[90vh]">
          <Loader size={48} />
        </div>
      ) : (
        <>
          <HighlightPopover
            renderPopover={({selection}) => <WordMeaningPopover selection={selection} />}
          >
            <div
              className={`flex flex-col max-w-4xl mx-auto h-[calc(100vh-10rem)] pb-5 ${mode === "quiz" ? "overflow-hidden" : ""}`}
              ref={chatContainerRef}
            >
              {mode === "quiz" ? (
                <InlineQuiz sessionId={sessionID} />
              ) : messages.length > 0 ? (
                <ChatbotMessages />
              ) : (
                <NewChat />
              )}
            </div>
          </HighlightPopover>

          {socketConnected && <ChatbotInputField ref={chatInputRef} />}
          
          {/* Persistent Status Indicator */}
          <PersistentStatusIndicator />
        </>
      )}
    </div>
  );
};

export default ChatBotChat;
