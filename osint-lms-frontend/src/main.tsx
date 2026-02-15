import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './auth/AuthContext'
import { GameProvider } from './context/GameContext'
import './index.css'
import './responsive.css'
import './animations.css'
import { ThemeProvider } from './context/ThemeContext'
import './theme.css'
import './theme-override.css'  // ← Guillemet fermant !

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <GameProvider>
            <App />
          </GameProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)