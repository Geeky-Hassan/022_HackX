"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, MessageSquare, Clock, History, Plus, Router } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DeleteButton, MoreButton, ShareButton } from "../CopyButton";
import { useChatbotStore } from "../../store/chatbotStore";
import { useRouter } from "next/navigation";
import { clearChat } from "../../mpHandler/chatbotChatHandler";
import { getChats, handleNewChat } from "@/services/llmChat";
interface ChatItem {
  id: string;
  title: string;
  date: string;
  preview?: string;
  lastUpdated: string; // Added for sorting
}

const ChatHistoryModal = ({ setShowChatHistory }: { setShowChatHistory: (value: boolean) => void }) => {
  const [deleteChat, setDeleteChat] = useState<boolean>(false);
  const [deleteChatId, setDeleteChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSessionID, setFetchChat, setMessages } = useChatbotStore();
  const route = useRouter();

  useEffect(() => {
    const fetchOlderChats = async () => {
      try {
        setLoading(true);
        const list = await getChats();

        const transformedChats: ChatItem[] = (list || []).map((c: any) => {
          const lastUpdated: string = c.last_updated || new Date().toISOString();
          return {
            id: c.chat_id,
            title: c.title || c.chat_id,
            preview: undefined,
            lastUpdated,
            date: formatDate(lastUpdated),
          };
        });

        transformedChats.sort(
          (a: ChatItem, b: ChatItem) =>
            new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
        );

        setChats(transformedChats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOlderChats();
  }, []);

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays <= 7) {
      if (diffInDays === 0) return "Today";
      if (diffInDays === 1) return "Yesterday";
      return `${diffInDays} days ago`;
    }

    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const filteredChats = chats.filter((chat) => {
    const searchTerm = searchQuery.toLowerCase();
    return chat.title.toLowerCase().includes(searchTerm);
  });

  // Get selected chat details
  const selectedChatDetails = chats.find((chat) => chat.id === selectedChat);
  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowChatHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowChatHistory]);

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowChatHistory(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [setShowChatHistory]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
    setSessionID(chatId);
    setFetchChat(true);
    setShowChatHistory(false);
    route.push(`/mp/chatbot?chat=${encodeURIComponent(chatId)}`);
  };

  const newChatHandler = async () => {
    await handleNewChat().then(
      (session) => {
        setSessionID(session);
        setMessages([])
        setShowChatHistory(false);
        route.push(`/mp/chatbot`);
      }
    )
  }

  const confirmClear = async (chat_id: string) => {
    setDeleteChatId(chat_id);
    setDeleteChat(true);
    await handleClearChat(chat_id);
  };

  // Clearing Chat function
  const handleClearChat = async (chat_id: any) => {
    try {
      const resp = await clearChat(chat_id);

      if (resp?.status === 200) {
        location.reload();
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 z-[999] flex items-center justify-center p-0 md:p-4 backdrop-blur-sm"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white/90 rounded-none md:rounded-xl shadow-2xl w-full md:max-w-3xl h-full md:h-[60vh] flex overflow-hidden border-0 md:border border-gray-200"
        >
          {/* Left panel - Chat list */}
          <div className="w-full border-r border-gray-200 flex flex-col">
            {/* Search header */}
            <div className="p-4 pb-0 space-y-4 pt-6 md:pt-4">
              <div className="relative flex items-center flex-row border-b border-neutral-200">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 rounded-xl text-dark-custom-dark-blue bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <button
                  onClick={() => {
                    setShowChatHistory(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div onClick={newChatHandler} className="text-gray-600 hover:bg-neutral-200 rounded-md pl-1 cursor-pointer flex flex-row gap-2 items-center py-2 md:py-1 transition-all">
                <Plus className="h-4 w-4" />
                <p>New chat</p>
              </div>
            </div>


            {/* Chat list content */}
            <div className="flex-1 md:mt-2 overflow-y-auto scroll-container">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredChats.length > 0 ? (
                <ul className="mt-1">
                  {filteredChats.map((chat) => (
                    <div key={chat.id} className="group flex">
                      <li
                        onClick={() => handleSelectChat(chat.id)}
                        className={`cursor-pointer text-dark-custom-dark-blue w-full flex justify-between items-center px-4 py-4 md:py-3 hover:bg-gray-100 transition-colors ${selectedChat === chat.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                          }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm truncate ${selectedChat === chat.id ? "font-medium text-blue-600" : ""}`}
                          >
                            {chat.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-1">{chat.preview}</p>
                          <p className="text-xs text-gray-400 mt-1">{chat.date}</p>
                        </div>
                      </li>
                      <span
                        className={`hidden group-hover:flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full`}
                      >
                        {/* <ShareButton /> */}
                        <button onClick={() => confirmClear(chat.id)}>
                          <DeleteButton />
                        </button>
                        {/* <MoreButton /> */}
                      </span>
                    </div>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-60 px-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    {searchQuery ? "No conversations found" : "No chats available"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 max-w-xs">
                    {searchQuery
                      ? `We couldn't find any conversations matching "${searchQuery}"`
                      : "You don't have any previous chats yet"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right panel - Preview (keep your existing preview panel) */}
          {/* Right panel - Preview */}
          {/* <div className="hidden md:flex md:w-1/2 lg:w-3/5 flex-col bg-gray-50 relative">
            {selectedChat ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedChatDetails?.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                  </p>
                </div>

                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{selectedChatDetails?.preview}</p>
                  </div>

                  <div className="mt-8 space-y-6">
                    <div className="flex items-start justify-end flex-row-reverse gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-medium text-sm">U</span>
                      </div>
                      <div className="bg-blue-50 rounded-2xl rounded-tl-none px-4 py-3 max-w-md">
                        <p className="text-gray-800">
                          How can I implement this feature in my application?
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 justify-start flex-row-reverse">
                      <div className="bg-blue-500 rounded-2xl rounded-tr-none px-4 py-3 max-w-md">
                        <p className="text-white">
                          I can help you implement that feature. Let&apos;s break it down into
                          steps...
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">AI</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowChatHistory(false)}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-5 rounded-xl transition-colors font-medium shadow-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Continue conversation</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center p-6"
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                  <History className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Select a conversation to preview
                </h2>
                <p className="text-gray-500 max-w-sm">
                  Choose from your chat history or create a new conversation to get started
                </p>
              </motion.div>
            )}
          </div>
           */}
        </motion.div>
      </motion.div>
      {deleteChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-dark-custom-blue p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-black dark:text-dark-primary-text">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-black dark:text-dark-primary-text">
              Are you sure you want to delete your chats?
            </p>
            <div className="flex justify-end space-x-4">
              {/* <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button> */}
              <button
                onClick={handleClearChat}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChatHistoryModal;
