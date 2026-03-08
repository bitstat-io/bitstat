"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";
import { UserStoreProvider } from "@/context/user/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <UserStoreProvider>
        <Toaster position="top-center" />
        {children}
      </UserStoreProvider>
    </NextThemesProvider>
  );
}
