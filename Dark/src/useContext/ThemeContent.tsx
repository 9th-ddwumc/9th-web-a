import clsx from "clsx";
import { THEME, useTheme } from "./context/ThemeProvider";

export default function ThemeContent() {
        const {theme}  = useTheme();
        const isLightMode = theme === THEME.LIGHT;
    return (
        <div className={clsx('p-4 h-dch items-start justify-start w-full flex flex-col flex-1 transition-color',
            //flex-1: 남은 공간을 모두 차지 
            isLightMode ? 'bg-white' : 'bg-gray-800' )}
        >
            <h1 className={clsx('text-2xl font-bold mb-4  transition-color duration-500',
                isLightMode ? 'text-black' : 'text-white'
            )}>
                Theme Content
            </h1>
            <p className={clsx( 'mt-2 text-lg max-w-4xl transition-colors duration-500',
                isLightMode ? 'text-gray-700' : 'text-gray-300'
            )}>
                This is a sample content area that changes style based on the current theme.
            </p>
        </div>
    );
}