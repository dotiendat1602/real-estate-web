import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.includes('/auth/login/success')) {
    const localeMatch = pathname.match(/^\/(en|vi)/);
    const locale = localeMatch ? localeMatch[1] : 'en';

    const newUrl = new URL(`/${locale}/auth/login${search}`, request.url);

    return NextResponse.redirect(newUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
