"use client";
import {Tooltip} from "@mui/material";
import {Paperclip, Send, FileText, File as FileIcon, Loader2, Plus} from "lucide-react";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {socket} from "@/lib/socketClient";
import {useChatbotStore} from "../../../store/chatbotStore";
import HighlightedInput from "../../../components/global/HighlightedInput";
import GenericDropdown, {DropdownOption} from "../../../components/Dropdown/GenericDropdown";
import DropUp from "../../../components/Dropdown/dropUp";
import {dropUpOptions} from "../../../components/global/constants";
import {
  THINKING_MESSAGE,
  ERROR_MESSAGE,
  ALLOWED_FILE_TYPES,
  ALLOWED_MIME_TYPES,
  MAX_FILE_COUNT,
  MAX_INDIVIDUAL_FILE_SIZE,
  attachmentOptions,
  toolOptions,
} from "./constants";
import {AttachmentWithStatus} from "./types";
import {useAttachments, useAutoResizeTextarea} from "./hooks";
import {randomSessionIdGenerator} from "@/util/helpers";
import AttachmentPreview from "./AttachmentPreview";
import {createMessage, countWords, parseAtCommand, uploadToCloudinary} from "./utils";
import {useToast} from "../../../components/Toast";
import {useQueryClient} from "@tanstack/react-query";

const ChatbotInputField = memo(
  forwardRef<{focus: () => void}>((props, ref) => {
    const {
      sessionID,
      thinking,
      remainingWords,
      allowedWords,
      inputMessage,
      newChat,
      mode,
      agentName,
      setSessionID,
      setNewChat,
      setInputMessage,
      setRemainingWords,
      setMessages,
      setThinking,
    } = useChatbotStore();
    const queryClient = useQueryClient();

    // Refs
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    // Local state
    const [attachmentsWithStatus, setAttachmentsWithStatus] = useState<AttachmentWithStatus[]>([]);
    const [atDropdown, setAtDropdown] = useState(false);
    const [attachmentDropdown, setAttachmentDropdown] = useState(false);
    const [toolsDropdown, setToolsDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [attachmentSelectedIndex, setAttachmentSelectedIndex] = useState<number>(0);
    const [toolsSelectedIndex, setToolsSelectedIndex] = useState<number>(0);
    const [pendingMessage, setPendingMessage] = useState<string | null>(null);
    const [pendingToastId, setPendingToastId] = useState<string | null>(null);

    const {showToast, hideToast} = useToast();

    // Computed values
    const isQuizMode = mode === "quiz";
    const isInputDisabled = isQuizMode; // Only disable in quiz mode, not during thinking
    const isWordLimitExceeded = remainingWords < 0;
    const canSendMessage =
      (inputMessage.trim() !== "" || attachmentsWithStatus.length > 0) && remainingWords >= 0;
    const canAddMoreFiles = attachmentsWithStatus.length < MAX_FILE_COUNT;

    const {isUploading} = useAttachments(attachmentsWithStatus);

    // Auto-send functionality when uploads complete (support standalone files)
    useEffect(() => {
      if (pendingMessage !== null && !isUploading && attachmentsWithStatus.length > 0) {
        // All uploads are complete, send the message
        const allComplete = attachmentsWithStatus.every((a) => a.status === "complete");
        if (allComplete) {
          // Hide the pending toast
          if (pendingToastId) {
            hideToast(pendingToastId);
            setPendingToastId(null);
          }

          // Send the message automatically
          sendMessageWithAttachments(pendingMessage);
          setPendingMessage(null);
        }
      }
    }, [isUploading, attachmentsWithStatus, pendingMessage, pendingToastId, hideToast]);

    // Auto-focus textarea when not in quiz mode
    useEffect(() => {
      setThinking(false);
      if (!isQuizMode) textareaRef.current?.focus();
    }, [mode, setThinking, isQuizMode]);

    useEffect(() => {
      if (!thinking && !isQuizMode) textareaRef.current?.focus();
    }, [thinking, isQuizMode]);

    useAutoResizeTextarea(textareaRef, inputMessage);
    // Handle tools outside click
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setToolsDropdown(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    // Expose focus method through ref
    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          if (!isQuizMode) {
            textareaRef.current?.focus();
          }
        },
      }),
      [isQuizMode],
    );

    // Session management
    const ensureSession = useCallback(async () => {
      if (newChat) {
        const session = randomSessionIdGenerator();
        setNewChat(false);
        setSessionID(session);
        return session;
      }
      return sessionID;
    }, [newChat, sessionID, setNewChat, setSessionID]);

    const addErrorMessage = useCallback(
      (content: string) => {
        const currentSessionId = sessionID || "error-session";
        setMessages((prev: any[]) => [
          ...prev.filter((m: any) => m.content !== THINKING_MESSAGE),
          createMessage({newChat: false, conversation_id: currentSessionId, content}),
        ]);
      },
      [sessionID, setMessages],
    );

    // Cancel pending message
    const cancelPendingMessage = useCallback(() => {
      if (pendingToastId) {
        hideToast(pendingToastId);
        setPendingToastId(null);
      }
      setPendingMessage(null);
      showToast({
        message: "Message cancelled",
        status: "info",
        duration: 3000,
      });
    }, [pendingToastId, hideToast, showToast]);

    // Send message with attachments (used by both manual and auto-send)
    const sendMessageWithAttachments = useCallback(
      async (messageText: string) => {
        try {
          // Only create new session ID if we don't have one
          let currentSessionId = sessionID;
          const wasNewChat = newChat || !currentSessionId;
          if (!currentSessionId) {
            currentSessionId = await ensureSession();
          }

          const fileUrls = attachmentsWithStatus
            .filter((a) => a.status === "complete" && a.url)
            .map((a) => ({name: a.file.name, type: a.file.type, size: a.file.size, url: a.url!}));

          // Determine message category
          const getMessageCategory = (msg: string) => {
            if (msg.startsWith("@visualize") || msg === "visualize") return "visualize";
            if (msg.startsWith("@quiz") || msg === "quiz") return "quiz";
            return "chat";
          };

          const userMessage = createMessage({
            conversation_id: currentSessionId,
            category: getMessageCategory(messageText),
            role: "user",
            agentName: agentName,
            content: messageText,
            attachments: fileUrls.length > 0 ? fileUrls : undefined,
          });

          // Update UI and send message
          setMessages((prev: any[]) => [...prev, userMessage]);
          setInputMessage("");
          setRemainingWords(allowedWords);
          setAttachmentsWithStatus([]);

          // Request scroll to bottom when a user sends a message
          window.dispatchEvent(new Event("chat-scroll-to-bottom"));

          // Socket communication
          await socket.connect();
          await socket.emit("join_room", {chat_id: currentSessionId});

          // Add thinking message
          const thinkingMessage = createMessage({
            newChat: false,
            conversation_id: currentSessionId,
            type: "thinking",
            role: "PathAI",
            category: "chat",
            content: THINKING_MESSAGE,
          });
          setMessages((prev: any[]) => [
            ...prev.filter((m: any) => m.type !== "thinking"),
            thinkingMessage,
          ]);
          window.dispatchEvent(new Event("chat-scroll-to-bottom"));

          // Emit message and proactively refresh chat list quickly for immediacy
          await socket.emit("user_message", userMessage);
          if (wasNewChat) {
            queryClient.invalidateQueries({
              predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "llm-chats",
            });
          }

          // If this was a brand-new chat, optimistically add it to sidebar and refetch shortly after
          if (wasNewChat && currentSessionId) {
            const optimisticItem = {
              chat_id: currentSessionId,
              title: messageText?.trim().slice(0, 40) || "New Chat",
              last_updated: new Date().toISOString(),
            };

            const trySet = (key: any[]) => {
              queryClient.setQueryData<any[]>(key, (prev) => {
                if (!prev) return [optimisticItem];
                const exists = prev.some((c: any) => c?.chat_id === optimisticItem.chat_id);
                if (exists) return prev;
                return [optimisticItem, ...prev];
              });
            };
            trySet(["llm-chats", true]);
            trySet(["llm-chats", false]);

            // Fast refetch to reconcile cache ASAP
            queryClient.refetchQueries({
              predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "llm-chats",
              type: "active",
            });
          }
        } catch (error) {
          console.error(`Error sending message: ${error}`);
          addErrorMessage(ERROR_MESSAGE);
        }
      },
      [
        sessionID,
        attachmentsWithStatus,
        setMessages,
        setInputMessage,
        setRemainingWords,
        allowedWords,
        setAttachmentsWithStatus,
        ensureSession,
        addErrorMessage,
      ],
    );

    // Message handling
    const handleSendMessage = useCallback(async () => {
      if (isQuizMode) return;

      const trimmedMessage = inputMessage.trim();
      if (!trimmedMessage && attachmentsWithStatus.length === 0) return;

      // If there's already a pending message, don't create another one
      if (pendingMessage) return;

      // If files are uploading, show pending toast instead of blocking
      if (isUploading) {
        setPendingMessage(trimmedMessage);
        const toastId = showToast({
          message: "Waiting for attachments to upload before sending...",
          status: "loading",
          duration: 0, // Don't auto-hide
          button: {
            title: "Cancel",
            onClick: cancelPendingMessage,
          },
        });
        setPendingToastId(toastId);
        return;
      }

      // Send immediately if no uploads pending
      await sendMessageWithAttachments(trimmedMessage);
    }, [
      isQuizMode,
      isUploading,
      inputMessage,
      attachmentsWithStatus,
      pendingMessage,
      showToast,
      cancelPendingMessage,
      sendMessageWithAttachments,
    ]);

    const handleInputMessage = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (isQuizMode) return;
        const value = e.target.value;
        setInputMessage(value);
        const {shouldShowDropdown, query} = parseAtCommand(value);
        // Only show command dropdown if at-sign command has matches
        if (shouldShowDropdown) {
          const lower = (query || "").toLowerCase();
          const hasMatch = dropUpOptions.some((o) => o.title.toLowerCase().startsWith(lower));
          setAtDropdown(hasMatch);
          // Keep the selected index inside current filtered range
          setSelectedIndex((prev) => {
            const filtered = dropUpOptions.filter((o) => o.title.toLowerCase().startsWith(lower));
            if (filtered.length === 0) return 0;
            return Math.min(prev, filtered.length - 1);
          });
        } else {
          setAtDropdown(false);
          setSelectedIndex(0);
        }
        const wordCount = countWords(value);
        setRemainingWords(allowedWords - wordCount);
      },
      [allowedWords, isQuizMode, setInputMessage, setRemainingWords],
    );

    const handleDropupOption = useCallback(
      (option: string) => {
        setAtDropdown(false);
        const cursorPos = textareaRef.current?.selectionStart || 0;
        const beforeCursor = inputMessage.substring(0, cursorPos);
        const afterCursor = inputMessage.substring(cursorPos);
        const {lastAtPos} = parseAtCommand(beforeCursor);
        if (lastAtPos !== -1)
          setInputMessage(beforeCursor.substring(0, lastAtPos) + "@" + option + " " + afterCursor);
        else setInputMessage("@" + option + " " + afterCursor);
        textareaRef.current?.focus();
      },
      [inputMessage, setInputMessage],
    );

    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isQuizMode) return;
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (atDropdown) handleDropupOption(dropUpOptions[selectedIndex].title);
          else if (attachmentDropdown) {
            // handled by click
          } else if (canSendMessage) handleSendMessage();
        } else if (atDropdown) {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((p) => (p + 1) % dropUpOptions.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((p) => (p - 1 + dropUpOptions.length) % dropUpOptions.length);
          } else if (e.key === "Escape") {
            e.preventDefault();
            setAtDropdown(false);
          }
        } else if (attachmentDropdown) {
          if (e.key === "Escape") {
            e.preventDefault();
            setAttachmentDropdown(false);
          }
        }
      },
      [
        isQuizMode,
        atDropdown,
        attachmentDropdown,
        selectedIndex,
        canSendMessage,
        handleSendMessage,
        handleDropupOption,
      ],
    );

    // File upload helpers
    const uploadFile = useCallback(async (file: File) => {
      const newAttachment: AttachmentWithStatus = {file, status: "uploading", progress: 0};
      setAttachmentsWithStatus((prev) => [...prev, newAttachment]);

      try {
        const url = await uploadToCloudinary(file);
        setAttachmentsWithStatus((current) =>
          current.map((item) =>
            item.file === file ? {...item, status: "complete" as const, url} : item,
          ),
        );
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        setAttachmentsWithStatus((current) =>
          current.map((item) => (item.file === file ? {...item, status: "error" as const} : item)),
        );
      }
    }, []);

    // Clipboard paste handler
    useEffect(() => {
      const handlePaste = async (e: ClipboardEvent) => {
        if (isQuizMode || thinking || !canAddMoreFiles) {
          if (!canAddMoreFiles) {
            showToast({
              message: `Maximum ${MAX_FILE_COUNT} files allowed`,
              status: "error",
              duration: 4000,
            });
          }
          return;
        }

        const clipboardItems = e.clipboardData?.items;
        if (!clipboardItems) return;

        const imageItems = Array.from(clipboardItems).filter((item) =>
          item.type.startsWith("image/"),
        );
        if (imageItems.length === 0) return;

        const imageItem = imageItems[0];
        const imageBlob = imageItem.getAsFile();
        if (!imageBlob) return;

        if (imageBlob.size > MAX_INDIVIDUAL_FILE_SIZE) {
          showToast({
            message: "Image exceeds 50MB limit",
            status: "error",
            duration: 4000,
          });
          return;
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileExtension = imageItem.type.split("/")[1] || "png";
        const pastedFileName = `pasted-image-${timestamp}.${fileExtension}`;
        const pastedFile = new window.File([imageBlob], pastedFileName, {
          type: imageItem.type,
          lastModified: Date.now(),
        });

        await uploadFile(pastedFile);
      };

      document.addEventListener("paste", handlePaste);
      return () => document.removeEventListener("paste", handlePaste);
    }, [isQuizMode, thinking, canAddMoreFiles, uploadFile, showToast]);

    // Drag & drop files handler
    useEffect(() => {
      const handleDragDropFiles = async (e: Event) => {
        if (isQuizMode || thinking) return;

        const customEvent = e as CustomEvent<{files: File[]}>;
        const files = customEvent.detail.files;
        if (!files || files.length === 0) return;

        if (files.length > 10) {
          showToast({
            message: "You cannot upload more than 7 files at a time",
            status: "error",
            duration: 4000,
          });
          return;
        }

        const availableSlots = MAX_FILE_COUNT - attachmentsWithStatus.length;
        if (files.length > availableSlots) {
          showToast({
            message: `You can add ${availableSlots} more file(s). Maximum is 7.`,
            status: "error",
            duration: 4000,
          });
          return;
        }

        for (const file of files) {
          const typeOk =
            ALLOWED_MIME_TYPES.includes(file.type) ||
            ALLOWED_FILE_TYPES.some((ext) => file.name.toLowerCase().endsWith(ext));
          if (!typeOk) {
            showToast({
              message: `Unsupported file "${file.name}". Only PDF, PNG, JPEG/JPG allowed.`,
              status: "error",
              duration: 4000,
            });
            continue;
          }
          if (file.size > MAX_INDIVIDUAL_FILE_SIZE) {
            showToast({
              message: `File "${file.name}" exceeds 50MB limit`,
              status: "error",
              duration: 4000,
            });
            continue;
          }
          uploadFile(file);
        }
      };

      window.addEventListener("dragDropFiles", handleDragDropFiles);
      return () => window.removeEventListener("dragDropFiles", handleDragDropFiles);
    }, [isQuizMode, thinking, attachmentsWithStatus.length, uploadFile, showToast]);

    // File input handler
    const handleAttachment = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const incoming = Array.from(files);
        if (incoming.length > 10) {
          showToast({
            message: "You cannot upload more than 7 files at a time",
            status: "error",
            duration: 4000,
          });
          return;
        }

        const availableSlots = MAX_FILE_COUNT - attachmentsWithStatus.length;
        if (incoming.length > availableSlots) {
          showToast({
            message: `You can add ${availableSlots} more file(s). Maximum is 7.`,
            status: "error",
            duration: 4000,
          });
          return;
        }

        for (const file of incoming) {
          const typeOk =
            ALLOWED_MIME_TYPES.includes(file.type) ||
            ALLOWED_FILE_TYPES.some((ext) => file.name.toLowerCase().endsWith(ext));
          if (!typeOk) {
            showToast({
              message: "Only PDF, PNG and JPEG files are allowed",
              status: "error",
              duration: 4000,
            });
            continue;
          }
          if (file.size > MAX_INDIVIDUAL_FILE_SIZE) {
            showToast({
              message: "Each file must be 50 MB or less",
              status: "error",
              duration: 4000,
            });
            continue;
          }
          uploadFile(file);
        }

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      [uploadFile, attachmentsWithStatus.length, showToast],
    );

    // UI interaction handlers
    const handleAttachmentClick = useCallback(() => {
      if (isQuizMode) return;
      setAttachmentDropdown(!attachmentDropdown);
      setToolsDropdown(false);
      setAttachmentSelectedIndex(0);
    }, [isQuizMode, attachmentDropdown]);

    const handleAttachmentOption = useCallback((option: DropdownOption) => {
      setAttachmentDropdown(false);
      if (option.title === "Upload a file") fileInputRef.current?.click();
    }, []);

    const removeAttachment = useCallback((index: number) => {
      setAttachmentsWithStatus((prev) => prev.filter((_, i) => i !== index));
    }, []);
    // Tools handler

    // File utility functions
    const handleToolsClick = useCallback(() => {
      if (isQuizMode) return;
      setToolsDropdown(!toolsDropdown);
      setAttachmentDropdown(false);
      setToolsSelectedIndex(0);
    }, [isQuizMode, toolsDropdown]);
    const getFileIcon = useCallback((file: File) => {
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();

      if (fileType.startsWith("image/")) return null;
      if (fileType === "application/pdf" || fileName.endsWith(".pdf"))
        return <FileText className="w-8 h-8 text-red-500" />;
      if (fileType.includes("document") || fileName.endsWith(".docx") || fileName.endsWith(".doc"))
        return <FileText className="w-8 h-8 text-blue-500" />;
      return <FileIcon className="w-8 h-8 text-gray-500" />;
    }, []);

    const getFilePreviewUrl = useCallback((attachment: AttachmentWithStatus) => {
      if (
        attachment.status === "complete" &&
        attachment.url &&
        attachment.file.type.startsWith("image/")
      )
        return attachment.url;
      if (attachment.file.type.startsWith("image/")) return URL.createObjectURL(attachment.file);
      return null;
    }, []);

    // Cleanup blob URLs
    useEffect(
      () => () => {
        attachmentsWithStatus.forEach((attachment) => {
          if (attachment.file.type.startsWith("image/")) {
            const url = getFilePreviewUrl(attachment);
            if (url && !attachment.url) URL.revokeObjectURL(url);
          }
        });
      },
      [attachmentsWithStatus, getFilePreviewUrl],
    );

    // Highlight patterns for @ commands
    const getHighlightPatterns = useMemo(() => {
      // Highlight only if message starts with @ and matches known commands prefix
      if (!inputMessage.startsWith("@")) return [];
      const match = inputMessage.match(/^@([a-zA-Z]*)/);
      const prefix = (match?.[1] || "").toLowerCase();
      const hasAnyMatch = dropUpOptions.some((o) => o.title.toLowerCase().startsWith(prefix));
      if (!hasAnyMatch) return [];
      // Highlight only the @ and following letters up to non-word boundary, not whole line
      const escaped = `@${prefix}`.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return [{pattern: new RegExp(`^${escaped}`, "g"), className: "text-blue-500 font-semibold"}];
    }, [inputMessage]);

    return (
      <div
        className={`sticky bottom-0 z-40 w-full mx-auto md:px-4 pb-2 lg:pb-6 pt-2 bg-white ${isQuizMode ? "z-50" : ""}`}
      >
        <div className="flex flex-col mx-auto w-full max-w-4xl relative border rounded-xl shadow-sm shadow-neutral-100 border-neutral-300 bg-white p-1 overflow-visible">
          {attachmentsWithStatus.length > 0 && (
            <AttachmentPreview
              attachments={attachmentsWithStatus}
              getFilePreviewUrl={getFilePreviewUrl}
              getFileIcon={getFileIcon}
              formatFileSize={(b) => `${(b / 1024 / 1024).toFixed(1)} MB`}
              removeAttachment={removeAttachment}
            />
          )}

          <HighlightedInput
            textareaRef={textareaRef}
            value={inputMessage}
            onChange={handleInputMessage}
            onKeyDown={handleKeyPress}
            disabled={isInputDisabled}
            // BILAL YAHA SA HEIGHT KAM HOTI HA KUTTAY
            className="bg-white w-full  px-3 pt-2 outline-none resize-none max-h-[50px] rounded-xl"
            placeholder={isQuizMode ? "Chat is disabled in quiz mode" : "Message PathAI"}
            highlightPatterns={getHighlightPatterns}
          />

          {isWordLimitExceeded && (
            <div className="text-sm text-red-500 absolute bottom-2 right-14 sm:right-20">
              Token limit reached: {remainingWords}/{allowedWords}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="left flex">
              <div ref={dropdownRef} className="relative flex">
                {/* <Tooltip title={"Attach tools"} placement="top">
                  <button
                    disabled={isInputDisabled}
                    onClick={handleToolsClick}
                    className={`chatIconButton group bg-blue-50 ${attachmentsWithStatus.length > 0 || attachmentDropdown ? " hover:bg-blue-100" : "hover:bg-logo-primary/10"} ${isQuizMode ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label="Attach tools"
                  >
                    <Plus
                      className={`chatIcon group-hover:text-logo-primary ${attachmentsWithStatus.length > 0 || attachmentDropdown ? "text-logo-primary" : "text-neutral-400"}`}
                    />
                  </button>
                </Tooltip>
                <GenericDropdown
                  options={toolOptions}
                  selectedIndex={toolsSelectedIndex}
                  onOptionSelect={handleAttachmentOption}
                  position="top"
                  isVisible={toolsDropdown && !isQuizMode}
                /> */}
                <Tooltip title={"Upload a file"} placement="top">
                  <button
                    disabled={isInputDisabled}
                    onClick={handleAttachmentClick}
                    className={`chatIconButton group ${attachmentsWithStatus.length > 0 || attachmentDropdown ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-logo-primary/10"} ${isQuizMode ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label="Upload a file"
                  >
                    <Paperclip
                      className={`chatIcon group-hover:text-logo-primary ${attachmentsWithStatus.length > 0 || attachmentDropdown ? "text-logo-primary" : "text-neutral-400"}`}
                    />
                  </button>
                </Tooltip>
                <GenericDropdown
                  options={attachmentOptions}
                  selectedIndex={attachmentSelectedIndex}
                  onOptionSelect={handleAttachmentOption}
                  position="top"
                  isVisible={attachmentDropdown && !isQuizMode}
                />
              </div>
            </div>
            <div className="right">
              <Tooltip
                title={
                  pendingMessage
                    ? "Message queued - waiting for uploads"
                    : isUploading
                      ? "Send message (will wait for uploads to complete)"
                      : "Send message"
                }
                placement="top"
              >
                <button
                  disabled={isInputDisabled}
                  onClick={handleSendMessage}
                  className={`chatIconButton group ${canSendMessage ? "hover:text-logo-primary hover:bg-logo-primary/10" : "opacity-50 text-neutral-700 cursor-not-allowed"}`}
                  aria-label="Send Message"
                >
                  {pendingMessage ? (
                    <Loader2 className="chatIcon text-blue-600 animate-spin" />
                  ) : (
                    <Send className="chatIcon" />
                  )}
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_FILE_TYPES.join(",")}
          onChange={handleAttachment}
          style={{display: "none"}}
          multiple
        />
        {atDropdown && !isQuizMode && (
          <div className="pointer-events-none">
            <div className="relative max-w-3xl mx-auto">
              <div className="pointer-events-auto">
                <DropUp
                  dropUpOptions={dropUpOptions.filter((o) => {
                    const {shouldShowDropdown, query} = parseAtCommand(inputMessage);
                    if (!shouldShowDropdown) return false;
                    const lower = (query || "").toLowerCase();
                    return o.title.toLowerCase().startsWith(lower);
                  })}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={setSelectedIndex}
                  handleDropUpOption={handleDropupOption}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }),
);

ChatbotInputField.displayName = "ChatbotInputField";
export default ChatbotInputField;
