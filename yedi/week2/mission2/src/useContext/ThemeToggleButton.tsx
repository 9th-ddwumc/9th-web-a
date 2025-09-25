import { THEME, useTheme } from './context/ThemeProvider';
import clsx from 'clsx';

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <button 
      onClick={toggleTheme}
      className={clsx(
        'px-4 py-2 rounded-md transition-all border cursor-pointer font-medium',
        {
          '!bg-white !text-black border-gray-400 hover:border-gray-600': !isLightMode, // 다크모드
          '!bg-black !text-white border-black hover:border-gray-700': isLightMode,     // 라이트모드
        }
      )}
    >
      {isLightMode ? '다크 모드' : '라이트 모드'}
    </button>
  );
}