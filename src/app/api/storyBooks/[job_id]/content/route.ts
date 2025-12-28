/**
 * Storybook Content API Route
 *
 * This endpoint provides storybook content data for a given job ID.
 * Following the same authentication pattern as other protected endpoints.
 *
 * GET /api/storyBooks/{job_id}/content
 *
 * @param job_id - Unique identifier for the storybook generation job
 * @returns Storybook content data including pages, text, and images
 */

export const maxDuration = 60; // API request timeout for storybook content fetching
import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

// ------------------------
// Backend server URL for storybook content
// ------------------------
const apiUrl =
  process.env.NODE_ENV == "development"
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
// GET endpoint for fetching storybook content
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

    // Call backend API to get storybook content
    const response = await fetch(`${apiUrl}/api/v1/media/storybooks/${job_id}/content`, {
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
          message: errorData.message || "Failed to get storybook content",
          status: response.status,
        },
        {status: response.status},
      );
    }

    const result = await response.json();

    // Extract storybook data from the response
    // Backend returns: { storybook: { cover_image_signed_url, pages: [...], total_pages } }
    const storybookData = result.storybook || result;

    // Return the storybook content from backend
    return NextResponse.json(
      {
        content: storybookData,
        message: "Storybook content fetched successfully",
        status: 200,
      },
      {status: 200},
    );
  } catch (error: any) {
    console.error("Error fetching storybook content:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching the storybook content.",
        status: 500,
      },
      {status: 500},
    );
  }
}
