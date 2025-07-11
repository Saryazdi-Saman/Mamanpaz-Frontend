import { NextRequest, NextResponse } from "next/server";

export interface ABTestRoute {
  src: string; // The route that needs to be rewritten (e.g., "/")
  destinations: string[]; // Array of possible destination routes (e.g., ["/v1", "/v2"])
  cookieName?: string; // Optional custom cookie name, defaults to generated name
}

export function createABTestMiddleware(routes: ABTestRoute[]) {
  return function abTestMiddleware(
    req: NextRequest,
    i18nResponse: NextResponse
  ): NextResponse {
    const url = req.nextUrl.clone();
    const pathname = url.pathname;

    // Find matching route configuration
    const matchingRoute = routes.find(route => {
      // Extract locale from pathname (assuming format /{locale}/path)
      const pathSegments = pathname.split("/").filter(Boolean);
      if (pathSegments.length === 0) return false;
      
      const locale = pathSegments[0];
      const pathWithoutLocale = "/" + pathSegments.slice(1).join("/");
      
      // Match exact path or root path for locale
      return pathWithoutLocale === route.src || 
             (route.src === "/" && pathSegments.length === 1);
    });

    if (!matchingRoute) {
      return i18nResponse;
    }

    // Generate cookie name based on source path
    const cookieName = matchingRoute.cookieName || 
      `ab_test_${matchingRoute.src.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // Function to get assigned destination from cookies or assign a new one
    const getOrAssignDestination = (): string => {
      const assignedDestination = req.cookies.get(cookieName)?.value;

      if (assignedDestination && matchingRoute.destinations.includes(assignedDestination)) {
        return assignedDestination;
      } else {
        return matchingRoute.destinations[
          Math.floor(Math.random() * matchingRoute.destinations.length)
        ];
      }
    };

    // Check if i18n middleware returned a redirect
    if (i18nResponse.status >= 300 && i18nResponse.status < 400) {
      const redirectLocation = i18nResponse.headers.get("location");

      if (redirectLocation) {
        const redirectUrl = new URL(redirectLocation, req.url);
        const redirectPathSegments = redirectUrl.pathname.split("/").filter(Boolean);
        
        if (redirectPathSegments.length >= 1) {
          const locale = redirectPathSegments[0];
          const pathWithoutLocale = "/" + redirectPathSegments.slice(1).join("/");
          
          // Check if redirect matches our A/B test route
          if (pathWithoutLocale === matchingRoute.src || 
              (matchingRoute.src === "/" && redirectPathSegments.length === 1)) {
            const assignedDestination = getOrAssignDestination();
            
            // Rewrite to the assigned destination instead of redirecting
            const rewritePath = `/${locale}${assignedDestination}`;
            const rewriteResponse = NextResponse.rewrite(new URL(rewritePath, req.url));
            
            // Set cookie to remember the variant
            rewriteResponse.cookies.set(cookieName, assignedDestination, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 30, // 30 days
            });
            
            return rewriteResponse;
          }
        }
      }
    } else {
      // No redirect from i18n, check if we need to rewrite directly
      const pathSegments = pathname.split("/").filter(Boolean);
      
      if (pathSegments.length >= 1) {
        const locale = pathSegments[0];
        const pathWithoutLocale = "/" + pathSegments.slice(1).join("/");
        
        // Check if current path matches our A/B test route
        if (pathWithoutLocale === matchingRoute.src || 
            (matchingRoute.src === "/" && pathSegments.length === 1)) {
          const assignedDestination = getOrAssignDestination();
          
          // Rewrite to the assigned destination
          const rewritePath = `/${locale}${assignedDestination}`;
          const rewriteResponse = NextResponse.rewrite(new URL(rewritePath, req.url));
          
          // Set cookie if not already set
          if (!req.cookies.get(cookieName)?.value) {
            rewriteResponse.cookies.set(cookieName, assignedDestination, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 30, // 30 days
            });
          }
          
          return rewriteResponse;
        }
      }
    }

    return i18nResponse;
  };
}