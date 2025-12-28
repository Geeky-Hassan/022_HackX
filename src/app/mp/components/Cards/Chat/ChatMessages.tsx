// --------------------
// Imports
// --------------------
"use client";
import { useEffect, useRef } from "react";
import stateStore from "@/store/zuStore";
import moment from "moment";
import { isMessageSender } from "../../../../../util/helpers";
import { MessageType } from "@/types";

interface GroupedMessages {
  [key: string]: MessageType[];
}
// ------------------------
// Chat messages code starts here
// ------------------------
const ChatMessages = () => {
  const { user, messages, selectedChat } = stateStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ------------------------
  // Filter messages for the selected chat
  // ------------------------
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.fromId === user?.id && msg.toId === selectedChat?.friendId) ||
      (msg.toId === user?.id && msg.fromId === selectedChat?.friendId),
  );

  if (!user) {
    return (
      <div className="flex items-center text-dark-secondary-text justify-center h-full">
        <p>Log in to chat</p>
      </div>
    );
  }

  // ------------------------
  // ------------------------
  // ------------------------
  const groupMessagesByDate = (messages: MessageType[]): GroupedMessages => {
    const groups: GroupedMessages = {};
    messages.forEach((msg) => {
      const date = moment(msg.createdAt).startOf("day").format("YYYY-MM-DD");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  // ------------------------
  // ------------------------
  // ------------------------
  const renderDateSeparator = (date: string) => {
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");
    let dateText;

    if (moment(date).isSame(today, "day")) {
      dateText = "Today";
    } else if (moment(date).isSame(yesterday, "day")) {
      dateText = "Yesterday";
    } else {
      dateText = moment(date).format("MMMM D, YYYY");
    }

    return (
      <div className="flex items-center justify-center my-4">
        <div className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-600">
          {dateText}
        </div>
      </div>
    );
  };


  const groupedMessages = groupMessagesByDate(messages || []);

  return (
    <div className="flex-1 overflow-y-auto p-1 md:p-4 space-y-2">
      {filteredMessages && filteredMessages.length > 0 ? (
        Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {renderDateSeparator(date)}
            {msgs.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${isMessageSender(msg.fromId, user?.id) ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`max-w-[220px] sm:max-w-[400px] break-words rounded-md p-2 m-2 text-light-light-white ${isMessageSender(msg.fromId, user?.id)
                      ? "bg-[#16397f]"
                      : "bg-dark-custom-blue-stroke"
                    } flex flex-col`}
                >
                  <p className="mb-1">{msg.content}</p>
                  <span className="text-xs text-light-light-white self-end mt-1">
                    {moment(msg.createdAt).format("hh:mm A")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="shadow-lg bg-dark-button-blue text-light-light-white px-6 py-2 rounded-lg text-lg">
            Messages are end to end encrypted
          </p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
