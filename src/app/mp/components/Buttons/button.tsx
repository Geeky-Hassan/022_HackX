"use client";
import { Tooltip } from "@mui/material";
import { useMainAppStore } from "../../store/mainAppStore";
import { useChatbotStore } from "../../store/chatbotStore";
const Button = ({ title, icon, route }: { title: string; icon: any; route?: any }) => {
  const { showChatHistory, setShowChatHistory } = useMainAppStore();
  const { setNewChat, setFetchChat, setMessages, setSessionID } = useChatbotStore();
  const handleButton = () => {
    switch (title) {
      case "Chat History":
        setShowChatHistory(!showChatHistory);
        break;
      case "New Chat":
        setNewChat(true);
        setFetchChat(false);
        setMessages([]);
        // Clear session ID so a new one will be generated
        setSessionID(undefined);
        route.push("/mp/chatbot");
        break;
      default:
        return;
    }
  };
  return (
    <>
      <Tooltip title={title} arrow={true} placement="bottom">
        <button onClick={handleButton} className="">
          <div className="text-neutral-700 ">{icon}</div>
        </button>
      </Tooltip>
    </>
  );
};

export default Button;
