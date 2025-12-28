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

import {Streamdown} from "streamdown";

const ChatbotMessages = memo(() => {
  const {setQuiz, setShowQuiz, setQuizId} = quizStore();
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




  useEffect(() => {
    const handleReconnect = () => {
      socket.emit("join_room", {user_id: token, chat_id: sessionID});
    };

    socket.on(events.RECONNECT, handleReconnect);
    socket.on(events.PATHAI_CHUNK, handleResponseChunk);
    socket.on(events.QUIZ_ARTIFACT_GENERATED, handleQuizArtifactGenerated);
    socket.on(events.THINKING_START, handleThinkingStart);
    socket.on(events.THINKING_END, handleThinkingEnd);
    socket.on(events.GENERATION_COMPLETE, handleGenerationComplete);
    socket.on(events.ERROR, handleServerError);

    
    return () => {
      socket.off(events.RECONNECT, handleReconnect);
      socket.off(events.PATHAI_CHUNK, handleResponseChunk);
      socket.off(events.QUIZ_ARTIFACT_GENERATED, handleQuizArtifactGenerated);
      socket.off(events.THINKING_START, handleThinkingStart);
      socket.off(events.THINKING_END, handleThinkingEnd);
      socket.off(events.GENERATION_COMPLETE, handleGenerationComplete);
      socket.off(events.ERROR, handleServerError);

    };
  }, [
    sessionID,
    token,
    handleResponseChunk,
    handleQuizArtifactGenerated,
    handleThinkingStart,
    handleThinkingEnd,
    handleGenerationComplete,
    handleServerError,
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

    </>
  );
});

ChatbotMessages.displayName = "ChatbotMessages";

export default ChatbotMessages;
