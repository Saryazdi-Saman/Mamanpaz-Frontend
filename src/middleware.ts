import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createComingSoonRoutingMiddleware } from "./middlewares/coming-soon-routing";

const i18nMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const comingSoonRoutingMiddleware = createComingSoonRoutingMiddleware([
    "v1",
    // "/v2",
    // "/v3",
  ]);

  // First run the i18n middleware
  const i18nResponse = i18nMiddleware(req);

  // Then pass the i18n response to path assignment middleware
  const finalResponse = comingSoonRoutingMiddleware(req, i18nResponse);

  console.log(finalResponse);
  return finalResponse;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
