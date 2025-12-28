"use client";
// -------------------------
// Imports
// -------------------------
import {ChatHistoryCardProps, ChatHistoryType, StateType} from "@/types";
import {fetchChatMessages, markAsRead} from "@/app/mp/mpHandler/chat/ChatHandler";
import stateStore from "@/store/zuStore";
import UserImage from "../../UserImage";
// -------------------------
// Chat History code starts here
// -------------------------
const ChatHistoryCard = ({chat}: ChatHistoryCardProps) => {
  const {selectedChat, setSelectedChat, setMessages} = stateStore();

  // -----------------------------
  // Fetch chat messages
  // -----------------------------
  const handleSelectChat = async () => {
    setSelectedChat(chat);
    try {
      const res = await fetchChatMessages(chat.friendId);
      if (res) {
        setMessages(res);
      }
      // Reorder the chat array to bring the selected chat to the top
      stateStore.setState((prevState: StateType) => {
        const updatedChats = prevState.chats.filter(
          (c: ChatHistoryType) => c.friendId !== chat.friendId,
        );
        return {chats: [chat, ...updatedChats]};
      });
      await markAsRead(chat.friendId);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  // -------------------------
  // Extracting last time
  // -------------------------
  const getTimeAgo = (timestamp: any) => {
    if (timestamp === "0001-01-01T00:00:00Z") {
      return "";
    }

    const now = new Date();
    const messageTime = new Date(timestamp);
    // ------------------------
    // Check if the message is from today
    // ------------------------
    const isToday =
      now.getDate() === messageTime.getDate() &&
      now.getMonth() === messageTime.getMonth() &&
      now.getFullYear() === messageTime.getFullYear();

    if (isToday) {
      // ------------------------
      // Format time in 12-hour format with AM/PM
      // ------------------------
      let hours = messageTime.getHours();
      const minutes = messageTime.getMinutes();
      const amPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert 0 hour to 12 for 12-hour format
      const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")} ${amPm}`;
      return formattedTime;
    } else {
      // ------------------------
      // If it's not today, return the day of the week (e.g., Mon, Tue)
      // ------------------------
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return daysOfWeek[messageTime.getDay()];
    }
  };

  return (
    <div
      onClick={handleSelectChat}
      className={`flex items-center gap-3 pl-2 py-4 hover:bg-dark-primary-text ${selectedChat == chat && "bg-dark-primary-text"}  cursor-pointer border-b rounded transition-all`}
    >
      <UserImage {...Object(chat)} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate text-dark-custom-dark-blue">
            {chat.friendName}
          </h3>
          <div className="">
            {chat.unreadCount !== 0 ? (
              <div className="self-end size-6 bg-dark-logo-primary text-light-light-white rounded-full flex items-center justify-center text-sm">
                {chat.unreadCount}
              </div>
            ) : (
              <span
                className={`fixed 
              ${
                getTimeAgo(chat.lastMessageTime).includes("AM") ||
                getTimeAgo(chat.lastMessageTime).includes("PM")
                  ? "-ml-14"
                  : "-ml-8"
              } 
               mt-5 text-xs text-gray-400`}
              >
                {getTimeAgo(chat.lastMessageTime) || ""}
              </span>
            )}
          </div>
        </div>
        <p className="text-xs max-w-32 text-gray-400 truncate">
          {chat.lastMessage || "Start a conversation..."}
        </p>
      </div>
    </div>
  );
};

export default ChatHistoryCard;
