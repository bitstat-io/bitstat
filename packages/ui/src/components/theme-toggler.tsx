"use client";

import { useTheme } from "next-themes";
import { Button } from "@workspace/ui/components/button";
import { IconMoon, IconSun } from "@tabler/icons-react";

export default function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-muted-foreground hover:text-foreground"
      aria-label="Toggle theme"
    >
      <IconSun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <IconMoon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
