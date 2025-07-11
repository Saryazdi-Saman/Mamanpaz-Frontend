import { NextRequest, NextResponse } from "next/server";

export interface ReferralConfig {
  paramName?: string; // Query parameter name (default: 'ref')
  cookieName?: string; // Cookie name (default: 'referral_code')
  maxAge?: number; // Cookie expiration in seconds (default: 30 days)
}

export function createReferralMiddleware(config: ReferralConfig = {}) {
  const {
    paramName = 'ref',
    cookieName = 'referral_code',
    maxAge = 60 * 60 * 24 * 30 // 30 days
  } = config;

  return function referralMiddleware(
    req: NextRequest,
    previousResponse: NextResponse
  ): NextResponse {
    const url = req.nextUrl.clone();
    const referralCode = url.searchParams.get(paramName);

    // If no referral code in URL, pass through previous response
    if (!referralCode) {
      return previousResponse;
    }

    // Clean the referral parameter from URL
    url.searchParams.delete(paramName);

    // Handle different types of previous responses
    let finalResponse: NextResponse;

    if (previousResponse.status >= 300 && previousResponse.status < 400) {
      // Previous middleware returned a redirect
      const redirectLocation = previousResponse.headers.get("location");
      
      if (redirectLocation) {
        // Clean referral param from redirect URL too
        const redirectUrl = new URL(redirectLocation, req.url);
        redirectUrl.searchParams.delete(paramName);
        finalResponse = NextResponse.redirect(redirectUrl);
      } else {
        // Fallback redirect to cleaned URL
        finalResponse = NextResponse.redirect(url);
      }
    } else {
      // Previous middleware returned normal response, redirect to cleaned URL
      finalResponse = NextResponse.redirect(url);
    }

    // Set referral cookie
    finalResponse.cookies.set(cookieName, referralCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAge,
      path: "/"
    });

    // Copy any other cookies from previous response
    const previousCookies = previousResponse.headers.get("set-cookie");
    if (previousCookies) {
      finalResponse.headers.set("set-cookie", previousCookies);
    }

    return finalResponse;
  };
}