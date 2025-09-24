import { createContext, useContext, useState, type PropsWithChildren } from "react";

export enum THEME {
    LIGHT = "LIGHT",
    DARK = "DARK"
}

type TTheme = THEME.LIGHT | THEME.DARK

interface IThemeContext {
    theme: TTheme
    toggleTheme: () => void
}

export const ThemeContext = createContext<undefined>(undefined)

export const ThemeProvider = ({children}: PropsWithChildren) => {
    const [theme, setTheme] = useState<TTheme>(THEME.LIGHT)

    const toggleTheme = () => {
        setTheme((prevTheme) => 
            prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
        )
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>{children}</ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error("ThemeProvider에 감싸져 있어야 합니다")
    }

    return context
}