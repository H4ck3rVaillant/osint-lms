// Système de tracking de la progression pour le certificat

interface ProgressionData {
  dateDebut: string | null;
  dateFin: string | null;
  parcours: {
    debutant: boolean;
    intermediaire: boolean;
    avance: boolean;
  };
  exercices: boolean;
  etudesDeCas: boolean;
  quiz: {
    osintBasics: boolean;
    searchTechniques: boolean;
    geolocation: boolean;
    socialMedia: boolean;
    cryptoBlockchain: boolean;
    darkweb: boolean;
  };
  ctfChallenge: boolean;
}

const STORAGE_KEY = "certificat_progression";
const DATE_DEBUT_KEY = "formation_date_debut";

// Initialiser la date de début si première activité
export function initDateDebut() {
  const existing = localStorage.getItem(DATE_DEBUT_KEY);
  if (!existing) {
    const now = new Date().toISOString();
    localStorage.setItem(DATE_DEBUT_KEY, now);
    console.log("📅 Date de début de formation enregistrée:", now);
  }
}

// Récupérer la progression actuelle
export function getProgression(): ProgressionData {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    return JSON.parse(stored);
  }

  // Initialisation par défaut
  return {
    dateDebut: localStorage.getItem(DATE_DEBUT_KEY),
    dateFin: null,
    parcours: {
      debutant: false,
      intermediaire: false,
      avance: false,
    },
    exercices: false,
    etudesDeCas: false,
    quiz: {
      osintBasics: false,
      searchTechniques: false,
      geolocation: false,
      socialMedia: false,
      cryptoBlockchain: false,
      darkweb: false,
    },
    ctfChallenge: false,
  };
}

// Sauvegarder la progression
function saveProgression(data: ProgressionData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Marquer un parcours comme complété
export function markParcoursComplete(niveau: "debutant" | "intermediaire" | "avance") {
  initDateDebut();
  const progression = getProgression();
  progression.parcours[niveau] = true;
  checkAndMarkComplete(progression);
  saveProgression(progression);
  console.log(`✅ Parcours ${niveau} complété`);
}

// Marquer les exercices comme complétés
export function markExercicesComplete() {
  initDateDebut();
  const progression = getProgression();
  progression.exercices = true;
  checkAndMarkComplete(progression);
  saveProgression(progression);
  console.log("✅ Exercices complétés");
}

// Marquer les études de cas comme complétées
export function markEtudesDeCasComplete() {
  initDateDebut();
  const progression = getProgression();
  progression.etudesDeCas = true;
  checkAndMarkComplete(progression);
  saveProgression(progression);
  console.log("✅ Études de cas complétées");
}

// Marquer un quiz comme complété (appelé automatiquement si score ≥60%)
export function markQuizComplete(quizId: string) {
  initDateDebut();
  const progression = getProgression();
  
  const quizMap: Record<string, keyof typeof progression.quiz> = {
    "osint-basics": "osintBasics",
    "search-techniques": "searchTechniques",
    "geolocation": "geolocation",
    "social-media": "socialMedia",
    "crypto-blockchain": "cryptoBlockchain",
    "darkweb": "darkweb",
  };

  const quizKey = quizMap[quizId];
  if (quizKey) {
    progression.quiz[quizKey] = true;
    checkAndMarkComplete(progression);
    saveProgression(progression);
    console.log(`✅ Quiz ${quizId} complété`);
  }
}

// Marquer le CTF Challenge comme complété
export function markCTFComplete() {
  initDateDebut();
  const progression = getProgression();
  progression.ctfChallenge = true;
  checkAndMarkComplete(progression);
  saveProgression(progression);
  console.log("✅ CTF Challenge complété");
}

// Vérifier si TOUT est complété et marquer la date de fin
function checkAndMarkComplete(progression: ProgressionData) {
  const allParcoursComplete = 
    progression.parcours.debutant &&
    progression.parcours.intermediaire &&
    progression.parcours.avance;

  const allQuizComplete = 
    progression.quiz.osintBasics &&
    progression.quiz.searchTechniques &&
    progression.quiz.geolocation &&
    progression.quiz.socialMedia &&
    progression.quiz.cryptoBlockchain &&
    progression.quiz.darkweb;

  const everythingComplete = 
    allParcoursComplete &&
    progression.exercices &&
    progression.etudesDeCas &&
    allQuizComplete &&
    progression.ctfChallenge;

  if (everythingComplete && !progression.dateFin) {
    progression.dateFin = new Date().toISOString();
    console.log("🎉 FORMATION COMPLÈTE ! Certificat disponible !");
  }
}

// Vérifier si le certificat est disponible
export function isCertificatAvailable(): boolean {
  const progression = getProgression();
  return progression.dateFin !== null;
}

// Obtenir le pourcentage de complétion
export function getCompletionPercentage(): number {
  const progression = getProgression();
  
  let completed = 0;
  let total = 11; // 3 parcours + 1 exercices + 1 études + 6 quiz + 1 CTF

  if (progression.parcours.debutant) completed++;
  if (progression.parcours.intermediaire) completed++;
  if (progression.parcours.avance) completed++;
  if (progression.exercices) completed++;
  if (progression.etudesDeCas) completed++;
  if (progression.quiz.osintBasics) completed++;
  if (progression.quiz.searchTechniques) completed++;
  if (progression.quiz.geolocation) completed++;
  if (progression.quiz.socialMedia) completed++;
  if (progression.quiz.cryptoBlockchain) completed++;
  if (progression.quiz.darkweb) completed++;
  if (progression.ctfChallenge) completed++;

  return Math.round((completed / total) * 100);
}

// Obtenir les détails de complétion pour l'affichage
export function getCompletionDetails() {
  const progression = getProgression();
  
  return {
    parcours: {
      debutant: progression.parcours.debutant,
      intermediaire: progression.parcours.intermediaire,
      avance: progression.parcours.avance,
      allComplete: progression.parcours.debutant && progression.parcours.intermediaire && progression.parcours.avance,
    },
    exercices: progression.exercices,
    etudesDeCas: progression.etudesDeCas,
    quiz: {
      osintBasics: progression.quiz.osintBasics,
      searchTechniques: progression.quiz.searchTechniques,
      geolocation: progression.quiz.geolocation,
      socialMedia: progression.quiz.socialMedia,
      cryptoBlockchain: progression.quiz.cryptoBlockchain,
      darkweb: progression.quiz.darkweb,
      allComplete: 
        progression.quiz.osintBasics &&
        progression.quiz.searchTechniques &&
        progression.quiz.geolocation &&
        progression.quiz.socialMedia &&
        progression.quiz.cryptoBlockchain &&
        progression.quiz.darkweb,
    },
    ctfChallenge: progression.ctfChallenge,
    dateDebut: progression.dateDebut,
    dateFin: progression.dateFin,
  };
}

// Reset (pour debug/admin uniquement)
export function resetProgression() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DATE_DEBUT_KEY);
  console.log("🔄 Progression réinitialisée");
}
