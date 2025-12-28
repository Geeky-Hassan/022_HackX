// -----------------------
// Imports
// -----------------------
import {ChatbotMessageType} from "@/types";
import Cookies from "js-cookie";
import axios from "axios";

function transformConversationData(
  responseData: any,
  sessionID: string | undefined,
): ChatbotMessageType[] {
  return responseData.conversations.flatMap((conversation: any) => {
    const userMessage: ChatbotMessageType = {
      conversation_id: sessionID,
      category: "chat",
      role: "user",
      type: "user_message",
      content: conversation.user_prompt,
    };

    // Combine all pathai_segment chunks into a single content string
    const aiSegments = conversation.turn_events
      .filter((event: any) => event.type === "pathai_segment")
      .map((event: any) => event.chunk)
      .join("\n\n");

    const aiMessage: ChatbotMessageType = {
      conversation_id: sessionID,
      category: "chat",
      role: conversation.role,
      type: "ai_response",
      content: aiSegments,
    };

    // Only include AI message if there's actual content
    return aiSegments ? [userMessage, aiMessage] : [userMessage];
  });
}

// -----------------------
// Fetching chatbot's chat history
// -----------------------
export const fetchChatHistory = async (sessionID: string | undefined) => {
  const response = await fetch(`/api/chatbotChatHistory?sessionID=${sessionID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: {revalidate: 3600},
  });

  const responseData = await response.json();
  if (responseData.status !== 200) {
    if (response.status === 401) {
      Cookies.remove("serviceToken");
      setTimeout(() => location.reload(), 3000);
    }
    throw new Error(responseData.message || "Failed to fetch chat history");
  }

  const normalizedMessages = transformConversationData(responseData.message, sessionID);

  return [responseData.message.metadata.title, normalizedMessages];
};

// export const createChatbotChat = async () => {
//   const response = await fetch("/api/createChatbotChat", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   const responseMessage = await response.json();

//   return responseMessage;
// };

// -----------------------
// Sending message to chatbot
// -----------------------
export const chatbotChat = async (message: ChatbotMessageType) => {
  const response = await fetch("/api/chatbot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
    next: {revalidate: 3600},
  });
  const responseMessage = await response.json();
  // Handle token expiration (keeps the same behavior)
  if (responseMessage.status === 401) {
    Cookies.remove("serviceToken");
    setTimeout(() => location.reload(), 3000);
    const botMessage: ChatbotMessageType = {
      conversation_id: message.conversation_id,
      role: "PathAI",
      category: message.category,
      content: "Session expired. Logging you in again.",
    };
    return botMessage;
  }

  // Handle rate limiting (keeps the same behavior)
  if (responseMessage.status === 429) {
    const botMessage: ChatbotMessageType = {
      conversation_id: message.conversation_id,
      role: "PathAI",
      category: message.category,
      content: "Resource Exhausted! Please try after some time",
    };
    return botMessage;
  }

  // Successful response with category handling
  if (response.status === 200) {
    const botMessage: ChatbotMessageType = {
      conversation_id: message.conversation_id,
      category: message.category,
      content: responseMessage.message,
    };

    return botMessage;
  }

  // Fallback error message
  const botMessage: ChatbotMessageType = {
    conversation_id: message.conversation_id,
    role: "PathAI",
    category: message.category, // Preserve original category
    content: "Please Try Sending Message Again",
  };
  return botMessage;
};

// -----------------------
// Generating visualization
// -----------------------

export const visualizer = async (sessionID: string | undefined) => {
  const token = Cookies.get("serviceToken");
  const resp = await axios.post(`/api/visualize`, {
    chatId: sessionID,
    token: token,
  });

  if (resp.status === 200) {
    const botMessage: ChatbotMessageType = {
      conversation_id: sessionID,
      role: "PathAI",
      category: "visualize",
      visualization: resp.data.message,
    };
    return botMessage;
  } else if (resp.status === 401) {
    Cookies.remove("serviceToken");
    setTimeout(() => location.reload(), 6000);
    const botMessage: ChatbotMessageType = {
      conversation_id: sessionID,
      role: "PathAI",
      category: "visualize",
      content: "Session expired. Logging you in again.",
    }; // Return a fallback message
    return botMessage;
  } else if (resp.status === 429) {
    const botMessage: ChatbotMessageType = {
      conversation_id: sessionID,
      role: "PathAI",
      category: "visualize",
      content: "Resource Exhausted!. Please try after some time",
    }; // Return a fallback message
    return botMessage;
  } else {
    const botMessage: ChatbotMessageType = {
      conversation_id: sessionID,
      role: "PathAI",
      category: "visualize",
      content: "Please Try Generating Visualization Again",
    };

    return botMessage;
  }
};
interface MeaningFetchType {
  message: string;
  status: number;
}

// -----------------------
// Fetching meaning
// -----------------------
export const meaningFetcher = async (word: string): Promise<MeaningFetchType> => {
  try {
    const resp = await axios.post(
      "/api/visualize",
      {
        word: word,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return {message: resp.data.message.definition, status: resp.status};
  } catch (error) {
    return {message: error as string, status: 500};
  }
};

export const clearChat = async (deleteChatId: string | null) => {
  try {
    const resp = await fetch("/api/chatbot", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({deleteChatId}),
    });

    if (resp.status === 200) {
      return {message: "Chat history cleared", status: resp.status};
    }
  } catch (error) {
    return {message: error, status: 500};
  }
};
