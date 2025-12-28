export const maxDuration = 60; // this is for the chatbot api request timeout; It is because we are on the free plan of vercel.
import {NextResponse} from "next/server";
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
export async function GET() {
  try {
    const token = await getToken();

    const response = await fetch(`${apiUrl}/create_chat`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseMessage = await response.json();

    return NextResponse.json({message: responseMessage.chat_id, status: response.status});
  } catch (error) {
    return NextResponse.json(
      {message: "Failed to create chatbot chat", status: 500},
      {status: 500},
    );
  }
}
