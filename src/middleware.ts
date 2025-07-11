import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { createABTestMiddleware } from "./middlewares/ab-test";
import { createReferralMiddleware } from "./middlewares/referral-tracking";

const i18nMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const referralMiddleware = createReferralMiddleware({
    paramName: 'ref',
    cookieName: 'referral_code',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });

  const abTestMiddleware = createABTestMiddleware([
    {
      src: "/",
      destinations: ["/coming-soon/v1", "/coming-soon/v2"],
      cookieName: "landing_variant"
    }
  ]);

  // Middleware chain: i18n → referral → A/B test
  const i18nResponse = i18nMiddleware(req);
  const referralResponse = referralMiddleware(req, i18nResponse);
  const finalResponse = abTestMiddleware(req, referralResponse);

  return finalResponse;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
