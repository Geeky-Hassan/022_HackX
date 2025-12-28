"use client";

import AgentButton from "../../components/Buttons/agentButton";
import {agents} from "../../components/global/constants";
import {useChatbotStore} from "../../store/chatbotStore";
import {randomSessionIdGenerator} from "@/util/helpers";
import {socket} from "@/lib/socketClient";
import {THINKING_MESSAGE} from "./ChatbotInputField/constants";
import {createMessage} from "./ChatbotInputField/utils";

const NewChat = () => {
  const {
    agentName,
    setAgentName,
    sessionID,
    newChat,
    setSessionID,
    setNewChat,
    setMessages,
    setRemainingWords,
    allowedWords,
  } = useChatbotStore();

  const sendSample = async (text: string) => {
    try {
      // Ensure a session
      let currentSessionId = sessionID;
      if (!currentSessionId || newChat) {
        currentSessionId = randomSessionIdGenerator();
        setSessionID(currentSessionId);
        setNewChat(false);
      }

      const userMessage = createMessage({
        conversation_id: currentSessionId,
        category: text.startsWith("@quiz") || text === "quiz" ? "quiz" : "chat",
        role: "user",
        agentName: agentName,
        content: text,
      });

      // Update UI
      setMessages((prev: any[]) => [...prev, userMessage]);
      setRemainingWords(allowedWords);

      // Connect and join
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
      // Send
      await socket.emit("user_message", userMessage);
    } catch (e) {
      console.error("Error sending sample message:", e);
    }
  };

  return (
    <div className=" mx-auto my-auto text-center w-full grid items-center justify-center text-dark-custom-dark-blue">
      <div className="intro">
        <div className="heading">
          <h1 className="text-3xl">Welcome to PathAI</h1>
          <p>Connect with our AI-powered chatbot to get personalized guidance and support.</p>
        </div>
        <div className="agents">
          <ul className="grid grid-cols-2 sm:flex items-center justify-center m-4 gap-4">
            {agents.map((link, index) => (
              <li key={index} className="flex items-center justify-center gap-2">
                <AgentButton
                  title={link.title}
                  icon={<link.icon />}
                  desc={link.desc}
                  active={agentName === link.title}
                  onClick={() => {
                    if (agentName !== link.title) {
                      setAgentName(link.title);
                    } else {
                      setAgentName("");
                    }
                  }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Sample prompts */}
        <div className="mt-6 space-y-3 mx-auto text-left">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-base">
            {agents
              .find((a) => a.title === agentName) // find the selected agent
              ?.sampleMessages.map((sample, index) => (
                <li key={index}>
                  <button
                    className="w-full text-left px-4 py-3 rounded-none border-b border-gray-200 hover:bg-gray-50 text-neutral-600"
                    onClick={() => sendSample(sample.title)}
                  >
                    {sample.title}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewChat;
