import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Définition des thèmes
export const themes = {
  dark: {
    // Backgrounds
    bgPrimary: "#0b0f1a",
    bgSecondary: "#1a1f2e",
    bgTertiary: "#2a3f3f",
    
    // Text
    textPrimary: "#e5e7eb",
    textSecondary: "#9ca3af",
    textTertiary: "#6b7280",
    
    // Accent
    accent: "#00ff9c",
    accentHover: "#00cc7a",
    accentDark: "#0a1a0f",
    
    // Borders
    border: "#2a3f3f",
    borderLight: "#1a1f2e",
    
    // Status
    success: "#00ff9c",
    error: "#ef4444",
    warning: "#fbbf24",
    info: "#3b82f6",
    
    // Autres
    shadow: "rgba(0, 0, 0, 0.5)",
    overlay: "rgba(11, 15, 26, 0.95)",
  },
  light: {
    // Backgrounds
    bgPrimary: "#ffffff",
    bgSecondary: "#f9fafb",
    bgTertiary: "#e5e7eb",
    
    // Text
    textPrimary: "#1f2937",
    textSecondary: "#4b5563",
    textTertiary: "#9ca3af",
    
    // Accent
    accent: "#2563eb",
    accentHover: "#1e40af",
    accentDark: "#eff6ff",
    
    // Borders
    border: "#d1d5db",
    borderLight: "#e5e7eb",
    
    // Status
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
    
    // Autres
    shadow: "rgba(0, 0, 0, 0.1)",
    overlay: "rgba(255, 255, 255, 0.95)",
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Récupérer le thème sauvegardé ou dark par défaut
    const saved = localStorage.getItem("theme");
    return (saved === "light" || saved === "dark") ? saved : "dark";
  });

  useEffect(() => {
    // Sauvegarder le thème
    localStorage.setItem("theme", theme);
    
    // Appliquer la classe au body pour les CSS globales
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme doit être utilisé dans un ThemeProvider");
  }
  return context;
}

// Hook utilitaire pour obtenir les couleurs du thème actuel
export function useThemeColors() {
  const { theme } = useTheme();
  return themes[theme];
}
