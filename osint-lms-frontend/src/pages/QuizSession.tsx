import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useGame } from "../context/GameContext";

interface Question {
  id: number;
  type: "qcm" | "boolean";
  question: string;
  options?: string[];
  correctAnswer: number; // Index de la bonne réponse (0, 1, 2, 3 pour QCM, 0=Vrai 1=Faux pour boolean)
  explanation: string;
}

// Base de données des questions par thème
const quizDatabase: Record<string, Question[]> = {
  "osint-basics": [
    { id: 1, type: "qcm", question: "Que signifie OSINT ?", options: ["Open Source Intelligence", "Operational Security Intelligence", "Online Security Information", "Open System Intelligence"], correctAnswer: 0, explanation: "OSINT = Open Source Intelligence, renseignement à partir de sources ouvertes." },
    { id: 2, type: "boolean", question: "L'OSINT consiste uniquement à utiliser Google pour chercher des informations.", correctAnswer: 1, explanation: "Faux. L'OSINT utilise de multiples sources : réseaux sociaux, bases de données publiques, registres, etc." },
    { id: 3, type: "qcm", question: "Quelle est la première étape d'une investigation OSINT ?", options: ["Collecte de données", "Définition des objectifs", "Analyse des résultats", "Rapport final"], correctAnswer: 1, explanation: "Définir clairement les objectifs permet de cibler la recherche et éviter la surcharge d'informations." },
    { id: 4, type: "boolean", question: "Il est légal d'utiliser l'OSINT pour collecter des informations publiques.", correctAnswer: 0, explanation: "Vrai. L'OSINT se base sur des sources publiques et ouvertes, ce qui est légal." },
    { id: 5, type: "qcm", question: "Quel outil permet de rechercher des archives web ?", options: ["Shodan", "Wayback Machine", "Maltego", "TheHarvester"], correctAnswer: 1, explanation: "Wayback Machine archive les anciennes versions des sites web." },
    { id: 6, type: "boolean", question: "Les métadonnées EXIF peuvent révéler la géolocalisation d'une photo.", correctAnswer: 0, explanation: "Vrai. Les métadonnées EXIF contiennent souvent les coordonnées GPS si activées sur l'appareil." },
    { id: 7, type: "qcm", question: "Quel opérateur Google permet de rechercher sur un site spécifique ?", options: ["site:", "domain:", "url:", "web:"], correctAnswer: 0, explanation: "L'opérateur 'site:' limite la recherche à un domaine précis (ex: site:example.com)." },
    { id: 8, type: "boolean", question: "Shodan est un moteur de recherche pour trouver des appareils IoT exposés.", correctAnswer: 0, explanation: "Vrai. Shodan indexe les appareils connectés à Internet (caméras, routeurs, serveurs, etc.)." },
    { id: 9, type: "qcm", question: "Quelle technique permet de trouver des sous-domaines ?", options: ["Port scanning", "DNS enumeration", "SQL injection", "XSS"], correctAnswer: 1, explanation: "L'énumération DNS révèle les sous-domaines d'un domaine principal." },
    { id: 10, type: "boolean", question: "L'OSINT peut être utilisé pour des enquêtes de cybersécurité.", correctAnswer: 0, explanation: "Vrai. L'OSINT est essentiel en cybersécurité pour la threat intelligence et l'analyse d'attaquants." },
    { id: 11, type: "qcm", question: "Quel format de fichier peut contenir des métadonnées exploitables ?", options: ["TXT", "PDF", "HTML", "CSV"], correctAnswer: 1, explanation: "Les PDF contiennent des métadonnées (auteur, logiciel, dates) très utiles en OSINT." },
    { id: 12, type: "boolean", question: "La recherche inversée d'image permet de trouver l'origine d'une photo.", correctAnswer: 0, explanation: "Vrai. Google Images, TinEye, Yandex permettent la recherche inversée." },
    { id: 13, type: "qcm", question: "Quel réseau social est le plus utilisé pour l'OSINT professionnel ?", options: ["Instagram", "LinkedIn", "TikTok", "Snapchat"], correctAnswer: 1, explanation: "LinkedIn regorge d'informations professionnelles : postes, entreprises, compétences, connections." },
    { id: 14, type: "boolean", question: "Il faut toujours créer un faux profil pour faire de l'OSINT sur les réseaux sociaux.", correctAnswer: 1, explanation: "Faux. Créer un faux profil peut être illégal et contraire aux CGU. L'OSINT passif est préférable." },
    { id: 15, type: "qcm", question: "Quel outil automatise la collecte d'informations OSINT ?", options: ["Nmap", "Maltego", "Burp Suite", "Metasploit"], correctAnswer: 1, explanation: "Maltego permet de visualiser et automatiser la collecte de données OSINT sous forme de graphes." },
    { id: 16, type: "boolean", question: "Les informations WHOIS d'un domaine sont toujours publiques.", correctAnswer: 1, explanation: "Faux. Depuis le RGPD, de nombreux domaines utilisent WHOIS privacy pour masquer les informations." },
    { id: 17, type: "qcm", question: "Que permet l'opérateur Google 'filetype:' ?", options: ["Chercher un type de fichier spécifique", "Filtrer par date", "Rechercher dans le titre", "Exclure des mots"], correctAnswer: 0, explanation: "filetype: permet de chercher des fichiers spécifiques (PDF, DOCX, XLS, etc.)." },
    { id: 18, type: "boolean", question: "Tor Browser permet de masquer son identité lors de recherches OSINT.", correctAnswer: 0, explanation: "Vrai. Tor anonymise la connexion en faisant passer le trafic par plusieurs nœuds." },
    { id: 19, type: "qcm", question: "Quelle base de données recense les fuites de données ?", options: ["Shodan", "Have I Been Pwned", "Censys", "VirusTotal"], correctAnswer: 1, explanation: "Have I Been Pwned répertorie les emails compromis dans des fuites de données." },
    { id: 20, type: "qcm", question: "Quel est le principe fondamental de l'OSINT ?", options: ["Pirater des systèmes", "Utiliser des sources publiques", "Créer des faux profils", "Intercepter des communications"], correctAnswer: 1, explanation: "L'OSINT repose exclusivement sur l'exploitation de sources ouvertes et légales." }
  ],
  // Les autres thèmes seront remplis progressivement
  "search-techniques": [],
  "geolocation": [],
  "social-media": [],
  "crypto-blockchain": [],
  "darkweb": []
};

export default function QuizSession() {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { addXP, unlockBadge } = useGame();

  const questions = quizDatabase[themeId || ""] || [];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(questions.length).fill(false));
  
  // Timers
  const [globalTime, setGlobalTime] = useState(15 * 60); // 15 minutes en secondes
  const [questionTime, setQuestionTime] = useState(30); // 30 secondes par question
  const [isFinished, setIsFinished] = useState(false);

  // Timer global
  useEffect(() => {
    if (isFinished || questions.length === 0) return;

    const interval = setInterval(() => {
      setGlobalTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFinished, questions.length]);

  // Timer par question
  useEffect(() => {
    if (isFinished || showExplanation || questions.length === 0) return;

    const interval = setInterval(() => {
      setQuestionTime((prev) => {
        if (prev <= 1) {
          // Temps écoulé, passer à la question suivante automatiquement
          handleNextQuestion();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, isFinished, showExplanation, questions.length]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation || answeredQuestions[currentQuestion]) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);
  };

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuestionTime(30);
    } else {
      handleFinishQuiz();
    }
  }, [currentQuestion, questions.length]);

  const handleFinishQuiz = () => {
    setIsFinished(true);
    
    const percentage = (score / questions.length) * 100;
    let badge = "";
    let xpGain = 0;

    if (percentage >= 95) {
      badge = `quiz_${themeId}_gold`;
      xpGain = 500;
    } else if (percentage >= 80) {
      badge = `quiz_${themeId}_silver`;
      xpGain = 300;
    } else if (percentage >= 60) {
      badge = `quiz_${themeId}_bronze`;
      xpGain = 150;
    }

    if (badge) {
      unlockBadge(badge, `Quiz ${themeId} - ${percentage >= 95 ? "Or" : percentage >= 80 ? "Argent" : "Bronze"}`);
    }
    
    if (xpGain > 0) {
      addXP(xpGain, `Terminé quiz ${themeId}`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScorePercentage = () => ((score / questions.length) * 100).toFixed(0);

  const getBadgeForScore = (percentage: number) => {
    if (percentage >= 95) return { emoji: "🥇", name: "Or", color: "#ffd700" };
    if (percentage >= 80) return { emoji: "🥈", name: "Argent", color: "#c0c0c0" };
    if (percentage >= 60) return { emoji: "🥉", name: "Bronze", color: "#cd7f32" };
    return { emoji: "❌", name: "Aucun", color: "#ef4444" };
  };

  if (questions.length === 0) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "80px"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🚧</div>
          <h2 style={{ color: colors.text, fontSize: "1.8rem", marginBottom: "15px" }}>
            Quiz en construction
          </h2>
          <p style={{ color: colors.textSecondary, marginBottom: "30px" }}>
            Les questions pour ce thème seront bientôt disponibles !
          </p>
          <button
            onClick={() => navigate("/quiz")}
            style={{
              background: colors.accent,
              color: "#fff",
              border: "none",
              padding: "12px 30px",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            ← Retour aux quiz
          </button>
        </div>
      </div>
    );
  }

  // Écran de résultats
  if (isFinished) {
    const percentage = parseFloat(getScorePercentage());
    const badge = getBadgeForScore(percentage);

    return (
      <div style={{ 
        minHeight: "100vh", 
        background: colors.background,
        paddingTop: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          maxWidth: "600px",
          width: "90%",
          background: colors.surface,
          borderRadius: "20px",
          padding: "50px",
          textAlign: "center",
          border: `2px solid ${badge.color}`
        }}>
          <div style={{ fontSize: "5rem", marginBottom: "20px" }}>{badge.emoji}</div>
          
          <h2 style={{ 
            color: colors.text, 
            fontSize: "2rem", 
            fontWeight: "700",
            marginBottom: "10px"
          }}>
            Quiz terminé !
          </h2>

          <div style={{
            fontSize: "3rem",
            fontWeight: "700",
            color: badge.color,
            marginBottom: "20px"
          }}>
            {score}/{questions.length}
          </div>

          <div style={{
            background: `${badge.color}20`,
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "30px"
          }}>
            <div style={{ 
              color: colors.textSecondary, 
              fontSize: "0.9rem",
              marginBottom: "8px"
            }}>
              Score
            </div>
            <div style={{ 
              fontSize: "2.5rem", 
              fontWeight: "700",
              color: badge.color
            }}>
              {percentage}%
            </div>
            <div style={{
              marginTop: "15px",
              padding: "12px",
              background: colors.background,
              borderRadius: "8px",
              color: colors.text,
              fontWeight: "600"
            }}>
              Badge {badge.name} {badge.emoji}
            </div>
          </div>

          <div style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center"
          }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "transparent",
                color: colors.accent,
                border: `2px solid ${colors.accent}`,
                padding: "12px 25px",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              🔄 Refaire
            </button>
            <button
              onClick={() => navigate("/quiz")}
              style={{
                background: colors.accent,
                color: "#fff",
                border: "none",
                padding: "12px 25px",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              📚 Autres quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: colors.background,
      paddingTop: "80px"
    }}>
      <div style={{ 
        maxWidth: "900px", 
        margin: "0 auto", 
        padding: "40px 20px" 
      }}>
        
        {/* Top Bar - Timers & Progress */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px"
        }}>
          {/* Timer global */}
          <div style={{
            background: globalTime < 60 ? "#ef444420" : `${colors.accent}15`,
            border: `2px solid ${globalTime < 60 ? "#ef4444" : colors.accent}`,
            borderRadius: "12px",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span style={{ fontSize: "1.3rem" }}>⏱️</span>
            <div>
              <div style={{ 
                fontSize: "0.75rem", 
                color: colors.textSecondary,
                marginBottom: "2px"
              }}>
                Temps total
              </div>
              <div style={{ 
                fontSize: "1.2rem", 
                fontWeight: "700",
                color: globalTime < 60 ? "#ef4444" : colors.text,
                fontFamily: "monospace"
              }}>
                {formatTime(globalTime)}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            padding: "12px 20px",
            flex: 1,
            minWidth: "200px"
          }}>
            <div style={{
              fontSize: "0.75rem",
              color: colors.textSecondary,
              marginBottom: "8px"
            }}>
              Question {currentQuestion + 1} / {questions.length}
            </div>
            <div style={{
              background: colors.background,
              borderRadius: "10px",
              height: "8px",
              overflow: "hidden"
            }}>
              <div style={{
                background: colors.accent,
                height: "100%",
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>

          {/* Score actuel */}
          <div style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            padding: "12px 20px",
            textAlign: "center"
          }}>
            <div style={{ 
              fontSize: "0.75rem", 
              color: colors.textSecondary,
              marginBottom: "2px"
            }}>
              Score
            </div>
            <div style={{ 
              fontSize: "1.2rem", 
              fontWeight: "700",
              color: colors.accent
            }}>
              {score}/{currentQuestion + (answeredQuestions[currentQuestion] ? 1 : 0)}
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div style={{
          background: colors.surface,
          borderRadius: "20px",
          padding: "40px",
          border: `2px solid ${colors.border}`,
          marginBottom: "30px"
        }}>
          {/* Timer question */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px"
          }}>
            <div style={{
              background: questionTime < 10 ? "#ef444420" : `${colors.accent}10`,
              border: `2px solid ${questionTime < 10 ? "#ef4444" : colors.accent}`,
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              fontWeight: "700",
              color: questionTime < 10 ? "#ef4444" : colors.accent,
              fontFamily: "monospace"
            }}>
              {questionTime}s
            </div>
          </div>

          {/* Type de question */}
          <div style={{
            display: "inline-block",
            background: question.type === "qcm" ? "#3b82f620" : "#f59e0b20",
            color: question.type === "qcm" ? "#3b82f6" : "#f59e0b",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: "600",
            marginBottom: "20px"
          }}>
            {question.type === "qcm" ? "QCM" : "Vrai/Faux"}
          </div>

          {/* Question text */}
          <h3 style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: colors.text,
            lineHeight: "1.6",
            marginBottom: "35px"
          }}>
            {question.question}
          </h3>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {question.type === "qcm" ? (
              question.options?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showResult = showExplanation;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    style={{
                      background: showResult 
                        ? isCorrect 
                          ? "#10b98120" 
                          : isSelected 
                            ? "#ef444420" 
                            : colors.background
                        : isSelected
                          ? `${colors.accent}20`
                          : colors.background,
                      border: `2px solid ${
                        showResult
                          ? isCorrect
                            ? "#10b981"
                            : isSelected
                              ? "#ef4444"
                              : colors.border
                          : isSelected
                            ? colors.accent
                            : colors.border
                      }`,
                      borderRadius: "12px",
                      padding: "18px 24px",
                      fontSize: "1.05rem",
                      color: colors.text,
                      cursor: showExplanation ? "default" : "pointer",
                      textAlign: "left",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "15px"
                    }}
                  >
                    <div style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: showResult
                        ? isCorrect
                          ? "#10b981"
                          : isSelected
                            ? "#ef4444"
                            : "transparent"
                        : isSelected
                          ? colors.accent
                          : "transparent",
                      border: `2px solid ${
                        showResult
                          ? isCorrect
                            ? "#10b981"
                            : isSelected
                              ? "#ef4444"
                              : colors.border
                          : isSelected
                            ? colors.accent
                            : colors.border
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.9rem",
                      fontWeight: "700",
                      color: showResult && (isCorrect || isSelected) ? "#fff" : colors.textSecondary,
                      flexShrink: 0
                    }}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span style={{ flex: 1 }}>{option}</span>
                    {showResult && isCorrect && <span>✓</span>}
                    {showResult && isSelected && !isCorrect && <span>✗</span>}
                  </button>
                );
              })
            ) : (
              <>
                {["Vrai", "Faux"].map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.correctAnswer;
                  const showResult = showExplanation;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showExplanation}
                      style={{
                        background: showResult 
                          ? isCorrect 
                            ? "#10b98120" 
                            : isSelected 
                              ? "#ef444420" 
                              : colors.background
                          : isSelected
                            ? `${colors.accent}20`
                            : colors.background,
                        border: `2px solid ${
                          showResult
                            ? isCorrect
                              ? "#10b981"
                              : isSelected
                                ? "#ef4444"
                                : colors.border
                            : isSelected
                              ? colors.accent
                              : colors.border
                        }`,
                        borderRadius: "12px",
                        padding: "20px 30px",
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        color: colors.text,
                        cursor: showExplanation ? "default" : "pointer",
                        textAlign: "center",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {option} {showResult && isCorrect && "✓"} {showResult && isSelected && !isCorrect && "✗"}
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div style={{
              marginTop: "30px",
              padding: "20px",
              background: selectedAnswer === question.correctAnswer 
                ? "#10b98110" 
                : "#ef444410",
              border: `2px solid ${selectedAnswer === question.correctAnswer ? "#10b981" : "#ef4444"}`,
              borderRadius: "12px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px"
              }}>
                <span style={{ fontSize: "1.5rem" }}>
                  {selectedAnswer === question.correctAnswer ? "✅" : "❌"}
                </span>
                <strong style={{ 
                  color: selectedAnswer === question.correctAnswer ? "#10b981" : "#ef4444",
                  fontSize: "1.1rem"
                }}>
                  {selectedAnswer === question.correctAnswer ? "Bonne réponse !" : "Mauvaise réponse"}
                </strong>
              </div>
              <p style={{
                color: colors.textSecondary,
                lineHeight: "1.6",
                margin: 0
              }}>
                {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Next button */}
        {showExplanation && (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleNextQuestion}
              style={{
                background: colors.accent,
                color: "#fff",
                border: "none",
                padding: "16px 50px",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: `0 4px 15px ${colors.accent}40`
              }}
            >
              {currentQuestion < questions.length - 1 ? "Question suivante →" : "Voir les résultats 🎯"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
