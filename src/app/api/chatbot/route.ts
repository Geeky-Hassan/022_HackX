export const maxDuration = 60; // this is for the chatbot api request timeout; It is because we are on the free plan of vercel.
import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

// ------------------------
// Chatbots server URL
// ------------------------
const apiUrl =
  process.env.NODE_ENV === "development"
    ? process.env.DEVELOPMENT_CHATBOT_API_URL
    : process.env.PRODUCTION_CHATBOT_API_URL;

// ------------------------
// Extracting jwt token from cookies
// ------------------------
async function getToken() {
  const cookie = await cookies();
  return cookie.get("serviceToken")?.value;
}

// ------------------------
// 1 universal function for all get/post api requests
// ------------------------
async function fetchChatbotData(url: string, method: string, body?: any) {
  const token = await getToken();
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return response.json();
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    const chatbotData = await fetchChatbotData(`${apiUrl}/chat`, "POST", data);
    if (chatbotData.detail != undefined && chatbotData.detail.status === 401) {
      return NextResponse.json({message: chatbotData.detail.message, status: 401}, {status: 401});
    }

    return NextResponse.json({message: chatbotData}, {status: 200});
  } catch (error: any) {
    console.error("Error in chatbot API request:", error);
    return NextResponse.json({message: "Chatbot request failed.", status: 500}, {status: 500});
  }
}

// ------------------------
// Fetching user chats with chatbot
// ------------------------
export async function GET() {
  try {
    const token = await getToken();
    const chatbotDat = await fetch(`${apiUrl}/api/v1/chats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const chatbotData = await chatbotDat.json();

    if (chatbotData.detail != undefined && chatbotData.detail.status === 401) {
      return NextResponse.json({message: chatbotData.detail.message, status: 401}, {status: 401});
    }

    return NextResponse.json({message: chatbotData.chats, status: 200}, {status: 200});
  } catch (error: any) {
    console.error("Error in chatbot API request:", error);
    return NextResponse.json({message: "Chatbot request failed.", status: 500}, {status: 500});
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.conversationId) {
      return NextResponse.json(
        {message: "Conversation ID is required.", status: 400},
        {status: 400},
      );
    }
    const chatbotData = await fetch(
      `${apiUrl}/delete_conversation_history?chat=${data.conversationId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
      },
    );
    const responseData = await chatbotData.json();
    if (responseData.detail != undefined && responseData.detail.status === 401) {
      return NextResponse.json({message: responseData.detail.message, status: 401}, {status: 401});
    }

    return NextResponse.json(
      {message: responseData.conversation_history, status: 200},
      {status: 200},
    );
  } catch (error: any) {
    console.error("Error in chatbot API request:", error);
    return NextResponse.json({message: "Chatbot request failed.", status: 500}, {status: 500});
  }
}
