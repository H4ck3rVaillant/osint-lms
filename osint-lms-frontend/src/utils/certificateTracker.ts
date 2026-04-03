// Système de tracking de la progression pour le certificat

interface ProgressionData {
  dateDebut: string | null;
  dateFin: string | null;
  parcours: {
    debutant: boolean;
    intermediaire: boolean;
    avance: boolean;
  };
  modulesSpecialises: {
    shodan: boolean;
    linkedin: boolean;
    telegram: boolean;
    discord: boolean;
    theharvester: boolean;
    maltego: boolean;
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

export function initDateDebut() {
  const existing = localStorage.getItem(DATE_DEBUT_KEY);
  if (!existing) {
    const now = new Date().toISOString();
    localStorage.setItem(DATE_DEBUT_KEY, now);
    console.log("📅 Date de début de formation enregistrée:", now);
  }
}

function checkBadgesFromLocalStorage(): ProgressionData["parcours"] {
  const debIntro = localStorage.getItem("badge_deb_intro") === "true";
  const debMethodo = localStorage.getItem("badge_deb_methodo") === "true";
  const debOutils = localStorage.getItem("badge_deb_outils") === "true";
  const debutantComplete = debIntro && debMethodo && debOutils;

  const intIntro = localStorage.getItem("badge_int_intro") === "true";
  const intMethodo = localStorage.getItem("badge_int_methodo") === "true";
  const intOutils = localStorage.getItem("badge_int_outils") === "true";
  const intermediaireComplete = intIntro && intMethodo && intOutils;

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

function checkModulesFromLocalStorage(): ProgressionData["modulesSpecialises"] {
  return {
    shodan: localStorage.getItem("badge_module_shodan") === "true",
    linkedin: localStorage.getItem("badge_module_linkedin") === "true",
    telegram: localStorage.getItem("badge_module_telegram") === "true",
    discord: localStorage.getItem("badge_module_discord") === "true",
    theharvester: localStorage.getItem("badge_module_theharvester") === "true",
    maltego: localStorage.getItem("badge_module_maltego") === "true",
  };
}

function checkEtudesDeCasFromLocalStorage(): boolean {
  const caseGeo = localStorage.getItem("badge_case_geo") === "true";
  const caseMedia = localStorage.getItem("badge_case_media") === "true";
  const caseAttr = localStorage.getItem("badge_case_attr") === "true";
  const caseChrono = localStorage.getItem("badge_case_chrono") === "true";
  const caseFinal = localStorage.getItem("badge_cases_osint") === "true";
  
  return caseGeo && caseMedia && caseAttr && caseChrono && caseFinal;
}

function checkExercicesFromLocalStorage(): boolean {
  const exercicesCompleted = parseInt(localStorage.getItem("exercices_completed") || "0");
  return exercicesCompleted >= 20;
}

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

  try {
    const results = JSON.parse(quizResults);
    
    // Vérifier si c'est un tableau (nouveau format) ou un objet (ancien format)
    let quizData: any = {};
    
    if (Array.isArray(results)) {
      // Nouveau format: tableau de résultats
      results.forEach((result: any) => {
        if (result.themeId) {
          quizData[result.themeId] = result;
        }
      });
    } else {
      // Ancien format: objet direct
      quizData = results;
    }
    
    return {
      osintBasics: (quizData["osint-basics"]?.score || 0) >= 60,
      searchTechniques: (quizData["search-techniques"]?.score || 0) >= 60,
      geolocation: (quizData["geolocation"]?.score || 0) >= 60,
      socialMedia: (quizData["social-media"]?.score || 0) >= 60,
      cryptoBlockchain: (quizData["crypto-blockchain"]?.score || 0) >= 60,
      darkweb: (quizData["darkweb"]?.score || 0) >= 60,
    };
  } catch (error) {
    console.error("Erreur lecture quiz_results:", error);
    return {
      osintBasics: false,
      searchTechniques: false,
      geolocation: false,
      socialMedia: false,
      cryptoBlockchain: false,
      darkweb: false,
    };
  }
}

function checkCTFFromLocalStorage(): boolean {
  // Lire depuis cyberosint_challenges (source de vérité)
  const challengesStr = localStorage.getItem("cyberosint_challenges");
  if (!challengesStr) return false;
  
  try {
    const challenges = JSON.parse(challengesStr);
    const solvedCount = challenges.filter((ch: any) => ch.solved === true).length;
    
    // Il y a 11 challenges au total
    return solvedCount >= 11;
  } catch (error) {
    console.error("Erreur lecture challenges:", error);
    return false;
  }
}

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
      modulesSpecialises: {
        shodan: false,
        linkedin: false,
        telegram: false,
        discord: false,
        theharvester: false,
        maltego: false,
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

  progression.parcours = checkBadgesFromLocalStorage();
  progression.modulesSpecialises = checkModulesFromLocalStorage();
  progression.etudesDeCas = checkEtudesDeCasFromLocalStorage();
  progression.exercices = checkExercicesFromLocalStorage();
  progression.quiz = checkQuizFromLocalStorage();
  progression.ctfChallenge = checkCTFFromLocalStorage();

  checkAndMarkComplete(progression);
  saveProgression(progression);

  return progression;
}

function saveProgression(data: ProgressionData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function markParcoursComplete(niveau: "debutant" | "intermediaire" | "avance") {
  initDateDebut();
  const progression = getProgression();
  progression.parcours[niveau] = true;
  checkAndMarkComplete(progression);
  saveProgression(progression);
  console.log(`✅ Parcours ${niveau} complété`);
}

export function markExercicesComplete() {
  initDateDebut();
  const progression = getProgression();
  progression.exercices = true;
  checkAndMarkComplete(progression);
  saveProgression(progression);
  console.log("✅ Exercices complétés");
}

export function markEtudesDeCasComplete() {
  initDateDebut();
  const progression = getProgression();
  progression.etudesDeCas = true;
  checkAndMarkComplete(progression);
  saveProgression(progression);
  console.log("✅ Études de cas complétées");
}

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

export function markCTFComplete() {
  initDateDebut();
  const progression = getProgression();
  progression.ctfChallenge = true;
  checkAndMarkComplete(progression);
  saveProgression(progression);
  console.log("✅ CTF Challenge complété");
}

function checkAndMarkComplete(progression: ProgressionData) {
  const allParcoursComplete = 
    progression.parcours.debutant &&
    progression.parcours.intermediaire &&
    progression.parcours.avance;

  const allModulesComplete =
    progression.modulesSpecialises.shodan &&
    progression.modulesSpecialises.linkedin &&
    progression.modulesSpecialises.telegram &&
    progression.modulesSpecialises.discord &&
    progression.modulesSpecialises.theharvester &&
    progression.modulesSpecialises.maltego;

  const allQuizComplete = 
    progression.quiz.osintBasics &&
    progression.quiz.searchTechniques &&
    progression.quiz.geolocation &&
    progression.quiz.socialMedia &&
    progression.quiz.cryptoBlockchain &&
    progression.quiz.darkweb;

  const everythingComplete = 
    allParcoursComplete &&
    allModulesComplete &&
    progression.exercices &&
    progression.etudesDeCas &&
    allQuizComplete &&
    progression.ctfChallenge;

  if (everythingComplete && !progression.dateFin) {
    progression.dateFin = new Date().toISOString();
    console.log("🎉 FORMATION COMPLÈTE ! Certificat disponible !");
  }
}

export function isCertificatAvailable(): boolean {
  const progression = getProgression();
  return progression.dateFin !== null;
}

export function getCompletionPercentage(): number {
  const progression = getProgression();
  
  let completed = 0;
  let total = 17; // 3 parcours + 6 modules + 1 exercices + 1 études + 6 quiz + 1 CTF

  if (progression.parcours.debutant) completed++;
  if (progression.parcours.intermediaire) completed++;
  if (progression.parcours.avance) completed++;
  if (progression.modulesSpecialises.shodan) completed++;
  if (progression.modulesSpecialises.linkedin) completed++;
  if (progression.modulesSpecialises.telegram) completed++;
  if (progression.modulesSpecialises.discord) completed++;
  if (progression.modulesSpecialises.theharvester) completed++;
  if (progression.modulesSpecialises.maltego) completed++;
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

export function getCompletionDetails() {
  const progression = getProgression();
  
  return {
    parcours: {
      debutant: progression.parcours.debutant,
      intermediaire: progression.parcours.intermediaire,
      avance: progression.parcours.avance,
      allComplete: progression.parcours.debutant && progression.parcours.intermediaire && progression.parcours.avance,
    },
    modulesSpecialises: {
      shodan: progression.modulesSpecialises.shodan,
      linkedin: progression.modulesSpecialises.linkedin,
      telegram: progression.modulesSpecialises.telegram,
      discord: progression.modulesSpecialises.discord,
      theharvester: progression.modulesSpecialises.theharvester,
      maltego: progression.modulesSpecialises.maltego,
      allComplete: progression.modulesSpecialises.shodan && progression.modulesSpecialises.linkedin && progression.modulesSpecialises.telegram && progression.modulesSpecialises.discord && progression.modulesSpecialises.theharvester && progression.modulesSpecialises.maltego,
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

export function resetProgression() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DATE_DEBUT_KEY);
  console.log("🔄 Progression réinitialisée");
}
