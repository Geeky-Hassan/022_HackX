export const maxDuration = 60; // this is for the chatbot api request timeout; It is because we are on the free plan of vercel.
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

// ------------------------
// Chatbots server URL
// ------------------------
const apiUrl =
  process.env.NODE_ENV != "development"
    ? process.env.PRODUCTION_CHATBOT_API_URL
    : process.env.DEVELOPMENT_CHATBOT_API_URL;

// ------------------------
// Fetching visualization here
// ------------------------
export async function GET() {
  const cookie = await cookies();
  const token = cookie.get("serviceToken")?.value;

  try {
    const res = await fetch(`${apiUrl}/visualize`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    return NextResponse.json({message: data.animation_path}, {status: 200});
  } catch (error) {
    return NextResponse.json({error: error}, {status: 500});
  }
}

// ------------------------
// Fetching meaning here
// ------------------------
export async function POST(request: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get("serviceToken")?.value;
  const data = await request.json();
  try {
    const res = await fetch(`${apiUrl}/api/v1/get_meaning`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const meaning = await res.json();
    return NextResponse.json({message: meaning, status: 200}, {status: 200});
  } catch (error) {
    return NextResponse.json({error: error}, {status: 500});
  }
}
