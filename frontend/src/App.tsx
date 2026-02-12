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

/* AUTRES */
import ExercicesOSINT from "./pages/ExercicesOSINT";
import BadgesOSINT from "./pages/BadgesOSINT";

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
import InactivityWarning from "./components/InactivityWarning";

/* SCROLL TO TOP AU CHANGEMENT DE PAGE */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* ROUTE PROTÉGÉE */
function Protected({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/* LAYOUT */
function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <ScrollToTop />
      <InactivityWarning />
      <GameNotification />
      <Header />
      <div style={{ paddingTop: "80px", minHeight: "100vh" }}>
        {children}
      </div>
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* DASHBOARD */}
      <Route path="/dashboard" element={<Protected><Layout><Dashboard /></Layout></Protected>} />

      {/* DÉBUTANT */}
      <Route path="/parcours/debutant" element={<Protected><Layout><ParcoursDebutant /></Layout></Protected>} />
      <Route path="/parcours/debutant/introduction" element={<Protected><Layout><ParcoursDebutantIntroduction /></Layout></Protected>} />
      <Route path="/parcours/debutant/methodologie" element={<Protected><Layout><ParcoursDebutantMethodologie /></Layout></Protected>} />
      <Route path="/parcours/debutant/outils" element={<Protected><Layout><ParcoursDebutantOutils /></Layout></Protected>} />

      {/* INTERMÉDIAIRE */}
      <Route path="/parcours/intermediaire" element={<Protected><Layout><ParcoursIntermediaire /></Layout></Protected>} />
      <Route path="/parcours/intermediaire/introduction" element={<Protected><Layout><ParcoursIntermediaireIntroduction /></Layout></Protected>} />
      <Route path="/parcours/intermediaire/methodologie" element={<Protected><Layout><ParcoursIntermediaireMethodologie /></Layout></Protected>} />
      <Route path="/parcours/intermediaire/outils" element={<Protected><Layout><ParcoursIntermediaireOutils /></Layout></Protected>} />

      {/* AVANCÉ */}
      <Route path="/parcours/avance" element={<Protected><Layout><ParcoursAvance /></Layout></Protected>} />
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

      {/* AUTRES */}
      <Route path="/exercices-osint" element={<Protected><Layout><ExercicesOSINT /></Layout></Protected>} />
      <Route path="/badges-osint" element={<Protected><Layout><BadgesOSINT /></Layout></Protected>} />

      {/* NOUVEAUX OUTILS & RESSOURCES */}
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

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    </GameProvider>
  );
}
