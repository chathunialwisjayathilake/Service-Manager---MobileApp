export interface ThemeOption {
  id: string;
  label: string;
  swatch: string;
}

export const themes: ThemeOption[] = [
  { id: "indigo", label: "Indigo", swatch: "oklch(0.47 0.21 270)" },
  { id: "emerald", label: "Emerald", swatch: "oklch(0.55 0.15 162)" },
  { id: "ocean", label: "Ocean", swatch: "oklch(0.52 0.15 245)" },
  { id: "sunset", label: "Sunset", swatch: "oklch(0.55 0.19 45)" },
  { id: "plum", label: "Plum", swatch: "oklch(0.5 0.18 320)" },
];

const KEY = "servio-theme";

export function getSavedTheme(): string {
  if (typeof window === "undefined") return "indigo";
  return localStorage.getItem(KEY) ?? "indigo";
}

export function applyTheme(id: string) {
  if (id === "indigo") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", id);
  }
  localStorage.setItem(KEY, id);
}
