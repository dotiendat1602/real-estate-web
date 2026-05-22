"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function Provider({ children, ...props }: ThemeProviderProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            retryDelay: (attemptIndex) =>
              Math.min(300 * (attemptIndex + 1), 1000),
          },
        },
      })
  );
  const [showDevtools, setShowDevtools] = React.useState(false);

  React.useEffect(() => {
    setShowDevtools(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
      {process.env.NODE_ENV === "development" && showDevtools && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
