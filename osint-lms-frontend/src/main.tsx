import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import "./index.css";
import './responsive.css'
import './animations.css'
import { ThemeProvider } from './context/ThemeContext'
import './theme.css'
import './theme-override.css

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
     <ThemeProvider> 
      <AuthProvider>
        <App />
      </AuthProvider>
     </ThemeProvider> 
    </BrowserRouter>
  </React.StrictMode>
);
