export const locales = ["en", "vi"] as const;

export const defaultLocale = "en";

export type AppLocale = (typeof locales)[number];

export function isAppLocale(value?: string | null): value is AppLocale {
  return locales.includes(value as AppLocale);
}

export function getPathLocale(pathname?: string | null): AppLocale | null {
  const firstSegment = pathname?.split("/").filter(Boolean)[0];
  return isAppLocale(firstSegment) ? firstSegment : null;
}

export function stripLocalePrefix(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (isAppLocale(segments[0])) segments.shift();
  return `/${segments.join("/")}`;
}

export function withLocalePath(href: string, locale: string) {
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }

  const normalizedLocale = isAppLocale(locale) ? locale : defaultLocale;
  const [pathWithQuery, hash = ""] = href.split("#");
  const [path = "", query = ""] = pathWithQuery.split("?");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const pathLocale = getPathLocale(normalizedPath);
  const localizedPath = pathLocale
    ? normalizedPath
    : `/${normalizedLocale}${normalizedPath === "/" ? "" : normalizedPath}`;

  return `${localizedPath}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

export function switchLocalePath(pathname: string, locale: string) {
  const normalizedLocale = isAppLocale(locale) ? locale : defaultLocale;
  const pathWithoutLocale = stripLocalePrefix(pathname || "/");
  return withLocalePath(pathWithoutLocale, normalizedLocale);
}
