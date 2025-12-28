/**
 * PPT Stream URL API Route
 *
 * This endpoint provides secure, temporary URLs for PPT playback.
 * Following the same authentication pattern as other protected endpoints.
 *
 * GET /api/ppt/{job_id}/video-url
 *
 * @param job_id - Unique identifier for the PPT generation job
 * @returns Temporary signed URL for PPT playback (expires in 1 hour)
 */

export const maxDuration = 60; // API request timeout for PPT URL generation
import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

// ------------------------
// Backend server URL for PPT streaming
// ------------------------
const apiUrl =
  process.env.NODE_ENV === "development"
    ? process.env.DEVELOPMENT_CHATBOT_API_URL
    : process.env.PRODUCTION_CHATBOT_API_URL;

// ------------------------
// Extract JWT token from cookies for authentication
// ------------------------
async function getToken() {
  const cookie = await cookies();
  return cookie.get("serviceToken")?.value;
}

// ------------------------
// GET endpoint for fetching PPT stream URL
// ------------------------
export async function GET(request: NextRequest) {
  try {
    // Get authentication token
    const token = await getToken();

    if (!token) {
      return NextResponse.json({message: "Authentication required", status: 401}, {status: 401});
    }

    // Extract job_id from URL parameters
    const job_id = await request.nextUrl.pathname.split("/")[3];

    if (!job_id) {
      return NextResponse.json({message: "Job ID is required", status: 400}, {status: 400});
    }

    // Call backend API to get signed PPT URL
    const response = await fetch(`${apiUrl}/api/v1/media/ppt/${job_id}/video-url`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          message: errorData.message || "Failed to get ppt video URL",
          status: response.status,
        },
        {status: response.status},
      );
    }

    const result = await response.json();

    // Return the signed URL from backend
    return NextResponse.json(
      {
        signed_url: result.signed_url,
        message: "PPT video URL generated successfully",
        status: 200,
      },
      {status: 200},
    );
  } catch (error: any) {
    console.error("Error fetching ppt video URL:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching the ppt video URL.",
        status: 500,
      },
      {status: 500},
    );
  }
}
