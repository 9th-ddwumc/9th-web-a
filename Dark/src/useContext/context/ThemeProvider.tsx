import { createContext, useContext, useState, type PropsWithChildren, type ReactNode } from "react";

export const THEME = {
    LIGHT: 'light' as TTheme,
  DARK: 'dark' as TTheme,
} as const;

type TTheme = 'light' | 'dark';

interface IThemeContext {
    theme: TTheme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({children}: PropsWithChildren) => {
    const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

    const toggleTheme = () => {
        setTheme((prevTheme: TTheme) =>
            prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
    };

    return ( <ThemeContext.Provider value={{theme, toggleTheme}}> 
        {children}</ThemeContext.Provider>
        )

}
export const useTheme = () => {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }   
    return context;
};
