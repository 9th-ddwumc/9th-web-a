import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // BrowserRouter 불러오기

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* App 컴포넌트를 BrowserRouter로 감싸기 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)