import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeManagerProvider } from './theme/ThemeManagerProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeManagerProvider>
      <App />
    </ThemeManagerProvider>
  </StrictMode>,
)
