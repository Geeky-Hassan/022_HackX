import {NextRequest, NextResponse} from "next/server";


// ------------------------
// Backend server URL
// ------------------------
const apiUrl = process.env.BACKEND_SERVER_URL;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const response = await fetch(`${apiUrl}/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resp = await response.json();
    return NextResponse.json(resp, {status: response.status});
  } catch (error: any) {
    return NextResponse.json(error, {status: error.status});
  }
}
