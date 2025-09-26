import { useEffect, useState } from 'react'
import './index.css'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  return 'light'
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <>
      <h1>Lian&apos;s Darkmode</h1>

      <div className="card" style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
        <button onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>
          {theme === 'dark' ? '라이트 모드' : '다크 모드'}
        </button>
      </div>
    </>
  )
}

export default App
