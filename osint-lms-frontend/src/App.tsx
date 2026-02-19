import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./auth/AuthContext";
import { GameProvider } from "./context/GameContext";
import Header from "./components/Header";
import GameNotification from "./components/GameNotification";
/* PUBLIC */
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ContactPage from "./pages/ContactPage";
/* CORE */
import Dashboard from "./pages/Dashboard";
/* PARCOURS */
import ParcoursHub from "./pages/ParcoursHub";
import ParcoursDebutant from "./pages/ParcoursDebutant";
import ParcoursDebutantIntroduction from "./pages/ParcoursDebutantIntroduction";
import ParcoursDebutantMethodologie from "./pages/ParcoursDebutantMethodologie";
import ParcoursDebutantOutils from "./pages/ParcoursDebutantOutils";
import ParcoursIntermediaire from "./pages/ParcoursIntermediaire";
import ParcoursIntermediaireIntroduction from "./pages/ParcoursIntermediaireIntroduction";
import ParcoursIntermediaireMethodologie from "./pages/ParcoursIntermediaireMethodologie";
import ParcoursIntermediaireOutils from "./pages/ParcoursIntermediaireOutils";
import ParcoursAvance from "./pages/ParcoursAvance";
import ParcoursAvanceIntroduction from "./pages/ParcoursAvanceIntroduction";
import ParcoursAvanceMethodologie from "./pages/ParcoursAvanceMethodologie";
import ParcoursAvanceOutils from "./pages/ParcoursAvanceOutils";
/* CAS RÉELS */
import EtudesOSINT from "./pages/EtudesOSINT";
import CasGeoLocalisation from "./pages/CasGeoLocalisation";
import CasVerificationMedia from "./pages/CasVerificationMedia";
import CasAttribution from "./pages/CasAttribution";
import CasChronologie from "./pages/CasChronologie";
import CasFinalOSINT from "./pages/CasFinalOSINT";
/* QUIZ */
import QuizPage from "./pages/QuizPage";
import QuizSession from "./pages/QuizSession";
/* AUTRES */
import ExercicesOSINT from "./pages/ExercicesOSINT";
import BadgesOSINT from "./pages/BadgesOSINT";
import CertificatPage from "./pages/CertificatPage";
import YouTubePage from "./pages/YouTubePage";
/* NOUVEAUX OUTILS & RESSOURCES */
import HackerAI from "./pages/HackerAI";
import DependencyTrack from "./pages/DependencyTrack";
import OutilsCyber from "./pages/OutilsCyber";
import Referentiels from "./pages/Referentiels";
import VMAccess from "./pages/VMAccess";
import VMKali from "./pages/VMKali";
import VMParrot from "./pages/VMParrot";
import LabOSINT from "./pages/LabOSINT";
/* GAMIFICATION */
import CTFPage from "./pages/CTFPage";
import Leaderboard from "./pages/Leaderboard";
import Gamification from "./pages/Gamification";
/* ARGUS V2.0 */
import ArgusRecon from "./pages/ArgusRecon";
import ArgusConsole from "./pages/ArgusConsole";

/* SCROLL TO TOP */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* ROUTE PROTÉGÉE */
function Protected({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();

  // ✅ FIX F5: Attendre que le token soit vérifié avant de rediriger
  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0f1a"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "50px", height: "50px",
            border: "3px solid #2a3f3f",
            borderTop: "3px solid #00ff9c",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }} />
          <p style={{ color: "#9ca3af" }}>Chargement...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/* LAYOUT */
function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <Header />
      <GameNotification />
      {children}
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <ScrollToTop />
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Protected><Layout><Dashboard /></Layout></Protected>} />

        {/* PROFIL & CONTACT */}
        <Route path="/profil" element={<Protected><Layout><ProfilePage /></Layout></Protected>} />
        <Route path="/contact" element={<Protected><Layout><ContactPage /></Layout></Protected>} />

        {/* PARCOURS HUB */}
        <Route path="/parcours" element={<Protected><Layout><ParcoursHub /></Layout></Protected>} />

        {/* PARCOURS */}
        <Route path="/parcours-debutant" element={<Protected><Layout><ParcoursDebutant /></Layout></Protected>} />
        <Route path="/parcours/debutant" element={<Navigate to="/parcours-debutant" replace />} />
        <Route path="/parcours/debutant/introduction" element={<Protected><Layout><ParcoursDebutantIntroduction /></Layout></Protected>} />
        <Route path="/parcours/debutant/methodologie" element={<Protected><Layout><ParcoursDebutantMethodologie /></Layout></Protected>} />
        <Route path="/parcours/debutant/outils" element={<Protected><Layout><ParcoursDebutantOutils /></Layout></Protected>} />

        <Route path="/parcours-intermediaire" element={<Protected><Layout><ParcoursIntermediaire /></Layout></Protected>} />
        <Route path="/parcours/intermediaire" element={<Navigate to="/parcours-intermediaire" replace />} />
        <Route path="/parcours/intermediaire/introduction" element={<Protected><Layout><ParcoursIntermediaireIntroduction /></Layout></Protected>} />
        <Route path="/parcours/intermediaire/methodologie" element={<Protected><Layout><ParcoursIntermediaireMethodologie /></Layout></Protected>} />
        <Route path="/parcours/intermediaire/outils" element={<Protected><Layout><ParcoursIntermediaireOutils /></Layout></Protected>} />

        <Route path="/parcours-avance" element={<Protected><Layout><ParcoursAvance /></Layout></Protected>} />
        <Route path="/parcours/avance" element={<Navigate to="/parcours-avance" replace />} />
        <Route path="/parcours/avance/introduction" element={<Protected><Layout><ParcoursAvanceIntroduction /></Layout></Protected>} />
        <Route path="/parcours/avance/methodologie" element={<Protected><Layout><ParcoursAvanceMethodologie /></Layout></Protected>} />
        <Route path="/parcours/avance/outils" element={<Protected><Layout><ParcoursAvanceOutils /></Layout></Protected>} />

        {/* CAS RÉELS */}
        <Route path="/etudes-osint" element={<Protected><Layout><EtudesOSINT /></Layout></Protected>} />
        <Route path="/cas/geolocalisation" element={<Protected><Layout><CasGeoLocalisation /></Layout></Protected>} />
        <Route path="/cas/verification-media" element={<Protected><Layout><CasVerificationMedia /></Layout></Protected>} />
        <Route path="/cas/attribution" element={<Protected><Layout><CasAttribution /></Layout></Protected>} />
        <Route path="/cas/chronologie" element={<Protected><Layout><CasChronologie /></Layout></Protected>} />
        <Route path="/cas/final" element={<Protected><Layout><CasFinalOSINT /></Layout></Protected>} />

        {/* QUIZ */}
        <Route path="/quiz" element={<Protected><Layout><QuizPage /></Layout></Protected>} />
        <Route path="/quiz/:themeId" element={<Protected><Layout><QuizSession /></Layout></Protected>} />

        {/* AUTRES */}
        <Route path="/exercices-osint" element={<Protected><Layout><ExercicesOSINT /></Layout></Protected>} />
        <Route path="/badges-osint" element={<Protected><Layout><BadgesOSINT /></Layout></Protected>} />
        <Route path="/certificat" element={<Protected><Layout><CertificatPage /></Layout></Protected>} />
        <Route path="/youtube" element={<Protected><Layout><YouTubePage /></Layout></Protected>} />

        {/* OUTILS & RESSOURCES */}
        <Route path="/hacker-ai" element={<Protected><Layout><HackerAI /></Layout></Protected>} />
        <Route path="/dependency-track" element={<Protected><Layout><DependencyTrack /></Layout></Protected>} />
        <Route path="/outils-cyber" element={<Protected><Layout><OutilsCyber /></Layout></Protected>} />
        <Route path="/referentiels" element={<Protected><Layout><Referentiels /></Layout></Protected>} />
        <Route path="/vm-access" element={<Protected><Layout><VMAccess /></Layout></Protected>} />
        <Route path="/vm-kali" element={<Protected><Layout><VMKali /></Layout></Protected>} />
        <Route path="/vm-parrot" element={<Protected><Layout><VMParrot /></Layout></Protected>} />
        <Route path="/labo-osint" element={<Protected><Layout><LabOSINT /></Layout></Protected>} />

        {/* GAMIFICATION */}
        <Route path="/ctf" element={<Protected><Layout><CTFPage /></Layout></Protected>} />
        <Route path="/leaderboard" element={<Protected><Layout><Leaderboard /></Layout></Protected>} />
        <Route path="/progression" element={<Protected><Layout><Gamification /></Layout></Protected>} />

        {/* ARGUS V2.0 */}
        <Route path="/outils/argus" element={<Protected><Layout><ArgusRecon /></Layout></Protected>} />
        <Route path="/outils/argus/console" element={<Protected><Layout><ArgusConsole /></Layout></Protected>} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </GameProvider>
  );
}
