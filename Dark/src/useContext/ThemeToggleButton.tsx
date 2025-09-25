import { THEME, useTheme } from "../useContext/context/ThemeProvider";
import clsx from "clsx";

export default function ThemeToggleButton() {
    const {theme, toggleTheme}  = useTheme();
    const isLightMode = theme === THEME.LIGHT;
    return (
        <nav className={clsx('p-4 w-full flex justify-end transition-color',
            isLightMode ? 'bg-white' : 'bg-gray-800'
        )}>
            <button onClick={toggleTheme}
            className={clsx('px-4 py-2 mt-4 rounded-md transition-all',{
                'bg-black text-white': !isLightMode,
                'bg-white text-black': isLightMode
            })}>
                {isLightMode ? "🌙 다크모드" : "☀️ 라이트모드"}
            </button>
        </nav>
    );
}
