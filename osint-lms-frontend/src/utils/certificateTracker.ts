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

// NOUVELLE FONCTION : Vérifier les badges réels dans localStorage
function checkBadgesFromLocalStorage(): ProgressionData["parcours"] {
  // Parcours Débutant (3 badges)
  const debIntro = localStorage.getItem("badge_deb_intro") === "true";
  const debMethodo = localStorage.getItem("badge_deb_methodo") === "true";
  const debOutils = localStorage.getItem("badge_deb_outils") === "true";
  const debutantComplete = debIntro && debMethodo && debOutils;

  // Parcours Intermédiaire (3 badges)
  const intIntro = localStorage.getItem("badge_int_intro") === "true";
  const intMethodo = localStorage.getItem("badge_int_methodo") === "true";
  const intOutils = localStorage.getItem("badge_int_outils") === "true";
  const intermediaireComplete = intIntro && intMethodo && intOutils;

  // Parcours Avancé (3 badges)
  const advIntro = localStorage.getItem("badge_adv_intro") === "true";
  const advMethodo = localStorage.getItem("badge_adv_methodo") === "true";
  const advOutils = localStorage.getItem("badge_adv_outils") === "true";
  const avanceComplete = advIntro && advMethodo && advOutils;

  return {
    debutant: debutantComplete,
    intermediaire: intermediaireComplete,
    avance: avanceComplete,
  };
}

// NOUVELLE FONCTION : Vérifier les études de cas
function checkEtudesDeCasFromLocalStorage(): boolean {
  const caseGeo = localStorage.getItem("badge_case_geo") === "true";
  const caseMedia = localStorage.getItem("badge_case_media") === "true";
  const caseAttr = localStorage.getItem("badge_case_attr") === "true";
  const caseChrono = localStorage.getItem("badge_case_chrono") === "true";
  const caseFinal = localStorage.getItem("badge_cases_osint") === "true";
  
  return caseGeo && caseMedia && caseAttr && caseChrono && caseFinal;
}

// NOUVELLE FONCTION : Vérifier les exercices
function checkExercicesFromLocalStorage(): boolean {
  const exercicesCompleted = parseInt(localStorage.getItem("exercices_completed") || "0");
  return exercicesCompleted >= 20;
}

// NOUVELLE FONCTION : Vérifier les quiz
function checkQuizFromLocalStorage(): ProgressionData["quiz"] {
  const quizResults = localStorage.getItem("quiz_results");
  
  if (!quizResults) {
    return {
      osintBasics: false,
      searchTechniques: false,
      geolocation: false,
      socialMedia: false,
      cryptoBlockchain: false,
      darkweb: false,
    };
  }

  const results = JSON.parse(quizResults);
  
  return {
    osintBasics: results["osint-basics"]?.score >= 60,
    searchTechniques: results["search-techniques"]?.score >= 60,
    geolocation: results["geolocation"]?.score >= 60,
    socialMedia: results["social-media"]?.score >= 60,
    cryptoBlockchain: results["crypto-blockchain"]?.score >= 60,
    darkweb: results["darkweb"]?.score >= 60,
  };
}

// NOUVELLE FONCTION : Vérifier le CTF
function checkCTFFromLocalStorage(): boolean {
  const ctfProgress = localStorage.getItem("ctf_progress");
  if (!ctfProgress) return false;
  
  const progress = JSON.parse(ctfProgress);
  const solvedCount = progress.filter((ch: any) => ch.solved).length;
  
  return solvedCount >= 11; // Tous les CTF résolus
}

// Récupérer la progression actuelle EN TEMPS RÉEL
export function getProgression(): ProgressionData {
  const stored = localStorage.getItem(STORAGE_KEY);
  let progression: ProgressionData;
  
  if (stored) {
    progression = JSON.parse(stored);
  } else {
    progression = {
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

  // MISE À JOUR EN TEMPS RÉEL depuis le localStorage
  progression.parcours = checkBadgesFromLocalStorage();
  progression.etudesDeCas = checkEtudesDeCasFromLocalStorage();
  progression.exercices = checkExercicesFromLocalStorage();
  progression.quiz = checkQuizFromLocalStorage();
  progression.ctfChallenge = checkCTFFromLocalStorage();

  // Vérifier si tout est complété
  checkAndMarkComplete(progression);
  
  // Sauvegarder la progression mise à jour
  saveProgression(progression);

  return progression;
}

// Sauvegarder la progression
function saveProgression(data: ProgressionData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Marquer un parcours comme complété (DEPRECATED - détection auto maintenant)
export function markParcoursComplete(niveau: "debutant" | "intermediaire" | "avance") {
  initDateDebut();
  const progression = getProgression();
  progression.parcours[niveau] = true;
  checkAndMarkComplete(progression);
  saveProgression(progression);
  console.log(`✅ Parcours ${niveau} complété`);
}

// Marquer les exercices comme complétés (DEPRECATED)
export function markExercicesComplete() {
  initDateDebut();
  const progression = getProgression();
  progression.exercices = true;
  checkAndMarkComplete(progression);
  saveProgression(progression);
  console.log("✅ Exercices complétés");
}

// Marquer les études de cas comme complétées (DEPRECATED)
export function markEtudesDeCasComplete() {
  initDateDebut();
  const progression = getProgression();
  progression.etudesDeCas = true;
  checkAndMarkComplete(progression);
  saveProgression(progression);
  console.log("✅ Études de cas complétées");
}

// Marquer un quiz comme complété (DEPRECATED - détection auto)
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

// Marquer le CTF Challenge comme complété (DEPRECATED)
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
