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
export async function GET(request: NextRequest) {
  const token = await getToken();
  const sessionID = request.nextUrl.searchParams.get("sessionID");
  if (!sessionID) {
    return NextResponse.json({error: "sessionID is required"}, {status: 400});
  }

  const response = await fetch(`${apiUrl}/get_conversation_history/${sessionID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const responseMessage = await response.json();

  if (response.status === 200) {
    return NextResponse.json(
      {message: responseMessage.conversation_history, status: 200},
      {status: 200},
    );
  }
  if (responseMessage.status === 401) {
    return NextResponse.json({message: responseMessage.message, status: 401}, {status: 401});
  }
  return NextResponse.json({message: "Chatbot request failed.", status: 500}, {status: 500});
}
