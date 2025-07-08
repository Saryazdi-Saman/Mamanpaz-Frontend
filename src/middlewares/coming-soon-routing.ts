import { NextRequest, NextResponse } from "next/server";


function isBareOrComingSoonPath(segments: string[]) {
  return (
    segments.length === 1 ||
    (segments.length === 2 && segments[1] === "coming-soon")
  );
}

export function createComingSoonRoutingMiddleware(availablePaths: string[]) {
  return function pathAssignmentMiddleware(
    req: NextRequest,
    i18nResponse: NextResponse
  ) {
    const url = req.nextUrl.clone();

    // Function to get assigned path from cookies or assign a new one
    const getOrAssignPath = () => {
      const assignedPath = req.cookies.get("COMING_SOON_V")?.value;

      if (assignedPath && availablePaths.includes(assignedPath)) {
        return assignedPath;
      } else {
        return availablePaths[
          Math.floor(Math.random() * availablePaths.length)
        ];
      }
    };

    // Function to create redirect response with cookie
    const redirectAndSetCookie = (
      redirectUrl: string,
      assignedPath: string
    ) => {
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set("COMING_SOON_V", assignedPath, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return response;
    };

    // Check if i18n middleware returned a redirect
    if (i18nResponse.status >= 300 && i18nResponse.status < 400) {
      const redirectLocation = i18nResponse.headers.get("location");

      if (redirectLocation) {
        const redirectUrl = new URL(redirectLocation, req.url);
        const redirectPath = redirectUrl.pathname;

        // Check if redirect is to /[locale]/ or /[locale]/coming-soon
        const pathSegments = redirectPath.split("/").filter(Boolean);

        if (isBareOrComingSoonPath(pathSegments)) {
          const assignedPath = getOrAssignPath();
          redirectUrl.pathname = `/${pathSegments[0]}/coming-soon/${assignedPath}`;
          return redirectAndSetCookie(redirectUrl.toString(), assignedPath);
        }
      }
    } else {
      // No redirect from i18n, check if we need to redirect directly
      const pathname = url.pathname;
      const pathSegments = pathname.split("/").filter(Boolean);

      if (isBareOrComingSoonPath(pathSegments)) {
        const assignedPath = getOrAssignPath();
        url.pathname = `/${pathSegments[0]}/coming-soon/${assignedPath}`;
        return redirectAndSetCookie(url.toString(), assignedPath);
      }
      
      // Handle manual visits to specific variants like /[locale]/coming-soon/v2
      if (pathSegments.length === 3 && pathSegments[1] === "coming-soon") {
        const locale = pathSegments[0];
        const requestedVariant = pathSegments[2];
        
        // Check if the requested variant is in available paths
        if (availablePaths.includes(requestedVariant)) {
          const existingCookie = req.cookies.get("COMING_SOON_V")?.value;
          
          if (existingCookie) {
            if (existingCookie === requestedVariant) {
              // Cookie matches requested variant - let them stay
              return i18nResponse;
            } else {
              // Cookie exists but doesn't match - redirect to cookie version
              url.pathname = `/${locale}/coming-soon/${existingCookie}`;
              return NextResponse.redirect(url);
            }
          } else {
            // No cookie exists - set cookie to requested variant and proceed
            const response = NextResponse.next();
            response.cookies.set("COMING_SOON_V", requestedVariant, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 30, // 30 days
            });
            return response;
          }
        } else {
          // Requested variant is not in available paths - redirect to an existing route
          const assignedPath = getOrAssignPath();
          url.pathname = `/${locale}/coming-soon/${assignedPath}`;
          return redirectAndSetCookie(url.toString(), assignedPath);
        }
      }
    }
    return i18nResponse;
  };
}