import Navbar from "./Navbar";
import ThemeContent from './ThemeContent';
import { ThemeProvider, useTheme, THEME } from "./context/ThemeProvider";

function ContextPageContent() {
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  return (
    <div className={`min-h-screen ${isLightMode ? 'bg-white' : 'bg-gray-800'}`}>
      <Navbar />
      <main className='w-full'>
        <ThemeContent />
      </main>
    </div>
  );
}

export default function ContextPage() {
  return (
    <ThemeProvider>
      <ContextPageContent />
    </ThemeProvider>
  );
}