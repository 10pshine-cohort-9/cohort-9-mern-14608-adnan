import type { ReactElement } from "react";
import { useTheme } from "@/components/theme-context";
import { Button } from "@/components/ui/button";

const ThemeToggle = (): ReactElement => {
  const { theme, setTheme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Button variant="outline" size="sm" onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? "Light mode" : "Dark mode"}
    </Button>
  );
};

export default ThemeToggle;
