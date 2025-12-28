import {NextRequest, NextResponse} from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const token = request.cookies.get("serviceToken");
  if (url.pathname.match("/mp/reset-password")) {
    return NextResponse.next();
  }
  if (!token && token == undefined) {
    // Unauthenticated user: Redirect to /mp/login unless already there
    if (!url.pathname.startsWith("/mp/login")) {
      return NextResponse.redirect(new URL("/mp/login", url.origin));
    }
    return NextResponse.next();
  }

  // Authenticated user logic
  if (url.pathname === "/mp") {
    // Redirect /mp to /mp/chatbot
    return NextResponse.redirect(new URL("/mp/chatbot", url.origin));
  }

  // Allow access to /mp/chatbot
  return NextResponse.next();
}

// Set matcher to listen for /mp and its subpaths
export const config = {
  matcher: ["/mp", "/mp/:path*"],
};
