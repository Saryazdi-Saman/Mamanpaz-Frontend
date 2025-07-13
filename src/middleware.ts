import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { createABTestMiddleware } from "./middlewares/ab-test";

const i18nMiddleware = createMiddleware(routing);

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number;
  path?: string;
}

export function middleware(req: NextRequest) {
  // Store cookies to set later
  const cookiesToSet: Array<{name: string, value: string, options: CookieOptions}> = [];
  
  // Handle referral param
  const refParam = req.nextUrl.searchParams.get('ref');
  if (refParam) {
    cookiesToSet.push({
      name: 'referral_code',
      value: refParam,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/"
      }
    });
  }
  
  // Handle session cookie
  if (!req.cookies.get('session_id')) {
    cookiesToSet.push({
      name: 'session_id',
      value: crypto.randomUUID(),
      options: {
        httpOnly: false, // Allow client-side access for analytics
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/"
      }
    });
  }

  const abTestMiddleware = createABTestMiddleware([
    {
      src: "/",
      destinations: ["/coming-soon/v1", "/coming-soon/v2"],
      cookieName: "landing_variant"
    }
  ]);

  // Middleware chain: i18n → A/B test
  const i18nResponse = i18nMiddleware(req);
  let finalResponse = abTestMiddleware(req, i18nResponse);
  
  // Clean ref param from URL as final step
  if (refParam) {
    if (finalResponse.status >= 300 && finalResponse.status < 400) {
      // Final response is a redirect, clean the redirect URL
      const redirectLocation = finalResponse.headers.get("location");
      if (redirectLocation) {
        const redirectUrl = new URL(redirectLocation, req.url);
        redirectUrl.searchParams.delete('ref');
        finalResponse = NextResponse.redirect(redirectUrl);
      }
    } else {
      // Final response is a rewrite/normal response, redirect to clean URL
      const cleanUrl = req.nextUrl.clone();
      cleanUrl.searchParams.delete('ref');
      finalResponse = NextResponse.redirect(cleanUrl);
    }
  }

  // Set all our cookies on the final response
  cookiesToSet.forEach(cookie => {
    finalResponse.cookies.set(cookie.name, cookie.value, cookie.options);
  });

  return finalResponse;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
