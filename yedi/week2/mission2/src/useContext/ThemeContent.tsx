import { THEME, useTheme } from './context/ThemeProvider';
import clsx from 'clsx';

export default function ThemeContent() {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <div className="p-8 min-h-screen w-full">
      <h1
        className={clsx(
          'text-2xl font-bold',
          isLightMode ? 'text-black' : 'text-white'
        )}
      >
        yedi
      </h1>
      <p className={clsx('mt-2', isLightMode ? 'text-black' : 'text-white')}>
        week2 mission2 week2 mission2 week2 mission2 week2 mission2 week2 mission2 week2 mission2
      </p>
    </div>
  );
}