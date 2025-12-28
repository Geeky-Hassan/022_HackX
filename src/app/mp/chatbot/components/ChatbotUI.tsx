"use client";
import { Suspense } from "react";
import ChatHistoryModal from "../../components/Modal/ChatHistoryModal";
import { useMainAppStore } from "../../store/mainAppStore";
import ChatBotChat from "./ChatBotChat";
import Loader from "../../components/Loaders/Loader";

const ChatbotUI = () => {
  const { showChatHistory, setShowChatHistory } = useMainAppStore();

  return (
    <>
      <div id='chatbot-ui' className="grid h-screen bg-white">
        <Suspense fallback={<div className="flex items-center justify-center h-[90vh]"><Loader size={48} /></div>}>
          <ChatBotChat />
        </Suspense>
        {showChatHistory && <ChatHistoryModal setShowChatHistory={setShowChatHistory} />}
      </div>
    </>
  );
};
export default ChatbotUI;
