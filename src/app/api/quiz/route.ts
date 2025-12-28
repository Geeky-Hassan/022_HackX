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
export async function POST(request: NextRequest) {
  try {
    const token = await getToken();
    const data = await request.json();

    const response = await fetch(`${apiUrl}/submit_quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data.values),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {message: errorData.message, status: response.status},
        {status: response.status},
      );
    }
    const result = await response.json();

    return NextResponse.json({message: "Quiz submission success!", status: 200}, {status: 200});
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while processing the quiz.",
        status: 500,
      },
      {status: 500},
    );
  }
}
