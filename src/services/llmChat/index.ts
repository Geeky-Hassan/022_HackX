import Cookies from "js-cookie";
import type { ChatbotMessageType } from "@/types";
import { llmClient } from "@/lib/apiClient";
import { socket } from "@/lib/socketClient";
import { randomSessionIdGenerator } from "@/util/helpers";

export type ChatListItem = {
  chat_id: string;
  title: string;
  last_updated?: string;
};

type ChatListResponse = {
  chats: ChatListItem[];
};

type ConversationTurn = {
  user_prompt: string;
  role: string;
  turn_events: Array<{ type: string; chunk?: string }>;
};

type ChatHistoryResponse = {
  metadata: { title?: string };
  conversations: ConversationTurn[];
};

function getAuthHeaders(): HeadersInit {
  const token = Cookies.get("serviceToken");
  if (!token) throw new Error("Missing auth token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getChats(): Promise<ChatListItem[]> {
  const resp = await llmClient.GET<ChatListResponse | any>(`/api/v1/chats`, {
    // bypass caches and CDNs aggressively
    headers: { 'cache-control': 'no-cache' },
  });
  const data = resp.data as ChatListResponse | any;
  return (data?.chats || data || []) as ChatListItem[];
}

function transformConversationData(
  responseData: ChatHistoryResponse,
  sessionID: string | undefined,
): ChatbotMessageType[] {
  return (responseData?.conversations || []).flatMap((conversation) => {
    const messages: ChatbotMessageType[] = [];

    // 1) User message
    messages.push({
      conversation_id: sessionID,
      category: "chat",
      role: "user",
      type: "user_message",
      content: conversation.user_prompt,
    });

    const turnEvents = conversation.turn_events || [];

    // 2) AI streamed text segments
    const aiSegments = turnEvents
      .filter((event) => event.type === "pathai_segment")
      .map((event) => event.chunk || "")
      .join("\n\n");

    if (aiSegments) {
      messages.push({
        conversation_id: sessionID,
        category: "chat",
        role: "PathAI", // Ensure proper alignment in UI
        type: "ai_response",
        content: aiSegments,
      });
    }

    // 3) Quiz artifact restoration from history (if present)
    const quizEvent: any = turnEvents.find(
      (e: any) =>
        e?.type === "quiz_generated" ||
        e?.type === "quiz_artifact_generated" ||
        e?.type === "quiz_artifact",
    );

    if (quizEvent && (quizEvent.quiz_data || quizEvent.quiz?.length)) {
      // Normalize quiz data shape
      const quizData = quizEvent.quiz_data || { questions: quizEvent.quiz };
      const quizId = quizEvent.quiz_id || quizEvent.id || "unknown-quiz-id";

      messages.push({
        conversation_id: sessionID,
        category: "quiz",
        role: "PathAI",
        type: "quiz_artifact",
        content: quizEvent.intro_text || "I've prepared a quiz for you.",
        quiz_id: quizId,
        quiz_data: quizData,
        topic: quizEvent.topic || "Quiz",
      } as any);
    }

    // 4) Video artifact restoration from history (if present)
    const videoEvent: any = turnEvents.find(
      (e: any) =>
        e?.type === "visualization_result" ||
        e?.type === "video_artifact_generated" ||
        e?.type === "video_artifact",
    );

    if (videoEvent && videoEvent.result?.status === "COMPLETE") {
      // Extract video information from the event
      const jobId = videoEvent.result.job_id || videoEvent.job_id || "unknown-job-id";
      const topic = videoEvent.result.topic || videoEvent.topic || "Video";
      const message = videoEvent.message || `Hey! I've finished creating your video animation about '${topic}'. You can view it now.`;

      messages.push({
        conversation_id: sessionID,
        category: "video",
        role: "PathAI",
        type: "video_artifact",
        content: message,
        job_id: jobId,
        topic: topic,
        video_status: "COMPLETE",
      } as any);
    }

    return messages;
  });
}

export async function getChatHistory(chatId: string): Promise<{ title: string; messages: ChatbotMessageType[] }> {
  const resp = await llmClient.GET<ChatHistoryResponse>(`/api/v1/chats/${encodeURIComponent(chatId)}`);
  const data = resp.data as ChatHistoryResponse;
  const messages = transformConversationData(data, chatId);
  const title = data?.metadata?.title || chatId;
  return { title, messages };
}

// creates a new chat and joins the room
// need to handle state updates manually for now
// TODO: find a better solution for this
export async function handleNewChat(): Promise<string> {
  const session = randomSessionIdGenerator();

  try {
    await socket.connect();
    await socket.emit("join_room", { chat_id: session });
  } catch (e) {
    // fail silently; sending a message will reconnect
    console.warn("Socket join failed", e);
  }

  return session;
}


