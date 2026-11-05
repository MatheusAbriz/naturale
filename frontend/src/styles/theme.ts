// Tokens extraídos 1:1 de src/assets/css/reset.css (os mesmos valores que
// alimentavam as variáveis CSS do Tailwind), para a migração para
// styled-components não mudar nenhuma cor/raio/sombra já em produção.

export const theme = {
  colors: {
    background: "#f7f7f1",
    foreground: "#203b36",
    card: "#ffffff",
    cardForeground: "#203b36",
    popover: "#ffffff",
    popoverForeground: "#203b36",
    primary: "#2f6b54",
    primaryForeground: "#ffffff",
    secondary: "#e4eee8",
    secondaryForeground: "#285443",
    muted: "#edf1eb",
    mutedForeground: "#64756e",
    accent: "#f4eadb",
    accentForeground: "#694a2e",
    destructive: "#b5413a",
    border: "#dce5dc",
    input: "#d0ddd3",
    ring: "#72a187",
    white: "#ffffff",
    black: "#000000",
  },
  radius: {
    sm: "12px",
    md: "14px",
    lg: "16px",
    xl: "20px",
    "2xl": "16px",
    "3xl": "24px",
    full: "9999px",
  },
  shadow: {
    card: "0 8px 28px rgba(39, 73, 58, 0.06)",
    cardHover: "0 12px 32px rgba(39, 73, 58, 0.12)",
    fab: "0 10px 24px rgba(47, 107, 84, 0.35)",
    dialog: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    dropdown: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  },
  font: {
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
} as const;

export type AppTheme = typeof theme;

// Replica o modificador de opacidade do Tailwind (`bg-primary/90`,
// `border-border/80` etc.) a partir de um hex — garante o mesmo valor de
// canal alfa, sem precisar catalogar cada combinação usada na UI.
export function alpha(hex: string, opacity: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const media = {
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
};
