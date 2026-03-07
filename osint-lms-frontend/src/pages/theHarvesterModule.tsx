import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function theHarvesterModule() {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const BADGE_KEY = "badge_module_theharvester";
  const ANSWERS_KEY = "quiz_answers_theharvester";
  const RESULTS_KEY = "quiz_results_theharvester";

  useState(() => {
    const savedAnswers = localStorage.getItem(ANSWERS_KEY);
    const savedResults = localStorage.getItem(RESULTS_KEY);
    if (savedAnswers) setQuizAnswers(JSON.parse(savedAnswers));
    if (savedResults === "true") setShowResults(true);
  });

  const tabs = [
    { id: "theory", label: "📖 Théorie", icon: "📚" },
    { id: "tools", label: "🔧 Outils", icon: "⚙️" },
    { id: "exercises", label: "💡 Exercices", icon: "✍️" },
    { id: "quiz", label: "🎯 Quiz", icon: "✅" },
  ];

  const quizQuestions = [
    { id: 1, question: "Que collecte principalement theHarvester ?", options: ["Emails, sous-domaines, IPs, noms", "Mots de passe chiffrés", "Fichiers sensibles", "Logs serveurs"], correct: 0 },
    { id: 2, question: "Quelles sources theHarvester interroge-t-il ?", options: ["Google, Bing, Shodan, LinkedIn, etc.", "Uniquement Google", "Bases de données SQL internes", "Fichiers locaux uniquement"], correct: 0 },
    { id: 3, question: "Quelle est la commande de base de theHarvester ?", options: ["theHarvester -d domain.com -b all", "harvester --scan domain.com", "python harvest.py -t domain", "theharvest -domain domain.com"], correct: 0 },
    { id: 4, question: "theHarvester est-il légal à utiliser ?", options: ["Oui si données publiques accessibles", "Non, toujours illégal", "Oui sans aucune restriction", "Nécessite autorisation écrite préalable"], correct: 0 },
    { id: 5, question: "Quels formats d'export theHarvester supporte-t-il ?", options: ["JSON, XML, HTML", "PDF uniquement", "SQL uniquement", "Texte brut uniquement"], correct: 0 }
  ];

  const handleQuizSubmit = () => {
    const score = getScore();
    setShowResults(true);
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(quizAnswers));
    localStorage.setItem(RESULTS_KEY, "true");
    if (score >= 4) {
      localStorage.setItem(BADGE_KEY, "true");
    }
  };

  const handleReset = () => {
    setQuizAnswers({});
    setShowResults(false);
    setShowResetModal(false);
    localStorage.removeItem(BADGE_KEY);
    localStorage.removeItem(ANSWERS_KEY);
    localStorage.removeItem(RESULTS_KEY);
  };

  const getScore = () => {
    let correct = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correct.toString()) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🌾</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Module theHarvester
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Collecte automatisée d'emails, sous-domaines, IPs et métadonnées OSINT
          </p>
          {localStorage.getItem(BADGE_KEY) === "true" && (
            <div style={{
              marginTop: "15px",
              display: "inline-block",
              padding: "8px 20px",
              background: colors.accent + "20",
              border: `2px solid ${colors.accent}`,
              borderRadius: "20px",
              color: colors.accent,
              fontWeight: "600",
              fontSize: "0.9rem"
            }}>
              ✓ Badge Expert theHarvester débloqué
            </div>
          )}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "40px",
          flexWrap: "wrap"
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 24px",
                background: activeTab === tab.id ? colors.accent : colors.bgSecondary,
                color: activeTab === tab.id ? "#020617" : colors.textPrimary,
                border: `2px solid ${activeTab === tab.id ? colors.accent : colors.border}`,
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.borderColor = colors.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.borderColor = colors.border;
                }
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{
          background: colors.bgSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          padding: "40px"
        }}>
          
          {activeTab === "theory" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                📖 theHarvester : Collecte OSINT Automatisée
              </h2>
              
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                <strong>theHarvester</strong> est un outil Python open-source développé initialement par <strong>Christian Martorella (Edge-Security)</strong> et maintenant maintenu par la communauté. Il permet de collecter automatiquement et massivement des <strong>adresses email, sous-domaines, noms de personnes, adresses IP et URLs</strong> associés à un domaine cible en interrogeant simultanément des dizaines de sources publiques différentes.
              </p>

              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "30px" }}>
                Contrairement aux outils de reconnaissance active comme Nmap qui scannent directement les cibles (détectable), theHarvester effectue une <strong>reconnaissance 100% passive</strong> en exploitant uniquement des données déjà indexées et publiquement accessibles : moteurs de recherche, réseaux sociaux professionnels, bases de données OSINT, certificats SSL publics, enregistrements DNS publics.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🎯 Cas d'usage stratégiques en OSINT
              </h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li><strong>Reconnaissance passive pré-attaque :</strong> Identifier l'intégralité de la surface d'exposition d'une cible (domaines, sous-domaines, serveurs, emails) sans effectuer le moindre scan actif détectable par les systèmes de défense</li>
                <li><strong>Cartographie exhaustive de surface d'attaque :</strong> Lister méthodiquement tous les sous-domaines cachés ou oubliés, serveurs exposés involontairement, adresses email publiques pouvant servir de vecteurs d'intrusion pour du phishing ciblé</li>
                <li><strong>Intelligence gathering organisationnelle :</strong> Collecter des informations précieuses sur l'infrastructure technique d'une organisation : serveurs mail exposés, serveurs DNS autoritaires, réseaux CDN utilisés, fournisseurs cloud employés</li>
                <li><strong>Audit de sécurité et évaluation d'exposition :</strong> Mesurer objectivement ce qu'un attaquant potentiel peut découvrir et exploiter sans aucune authentification, autorisation ou interaction directe avec les systèmes cibles</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                📊 Types de données collectées par theHarvester
              </h3>
              
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px", border: `1px solid ${colors.border}` }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px", fontSize: "1.2rem" }}>📧 Adresses email</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.7", margin: 0 }}>
                  Emails publiquement exposés et trouvés dans : pages web indexées par les moteurs de recherche (Google, Bing, Baidu), documents bureautiques avec métadonnées exposées (PDF, DOCX contenant champs "Auteur"), bases de données OSINT spécialisées (Hunter.io, RocketReach), profils LinkedIn professionnels indexés par Google, forums techniques et communautés (Stack Overflow, Reddit), dépôts de code source publics (GitHub, GitLab avec commits incluant emails), fichiers système exposés (robots.txt, sitemap.xml mentionnant contacts).
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px", border: `1px solid ${colors.border}` }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px", fontSize: "1.2rem" }}>🌐 Sous-domaines et infrastructure DNS</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.7", margin: 0 }}>
                  Sous-domaines découverts via multiples sources complémentaires : certificats SSL/TLS publics consultables (bases crt.sh et Censys Certificate Transparency logs), résolution DNS passive et brute-force léger sur patterns courants, moteurs de recherche avec Google dorks spécifiques (site:*.example.com), bases de données OSINT spécialisées (VirusTotal passive DNS, Shodan, SecurityTrails, RiskIQ). Exemples typiques découverts : mail.example.com (serveur mail), vpn.example.com (accès VPN), dev.example.com (environnement dev), staging.example.com (pré-production), admin.example.com (panel admin), api.example.com (API publique).
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", border: `1px solid ${colors.border}` }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px", fontSize: "1.2rem" }}>🖥️ Adresses IP, serveurs et métadonnées</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.7", margin: 0 }}>
                  Adresses IP publiques associées au domaine cible : serveurs web (enregistrements DNS A/AAAA), serveurs mail (enregistrements MX avec priorités), serveurs DNS autoritaires (enregistrements NS), CDN et load balancers (Cloudflare, Akamai, AWS CloudFront détectables via résolution). Métadonnées additionnelles : noms d'employés extraits depuis métadonnées de documents PDF exposés (champ Auteur), profils LinkedIn professionnels indexés par Google, pages "À propos" et "Équipe" des sites web corporate, articles de presse mentionnant des collaborateurs spécifiques.
                </p>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                🔧 Installation et Utilisation de theHarvester
              </h2>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>
                📥 Installation sur Linux/macOS
              </h3>
              <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                theHarvester nécessite <strong>Python 3.7+</strong> et s'installe rapidement via Git. Installation recommandée depuis le dépôt GitHub officiel pour obtenir la dernière version :
              </p>
              <div style={{
                background: colors.bgPrimary,
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: `1px solid ${colors.border}`,
                fontFamily: "monospace",
                fontSize: "0.95rem"
              }}>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}># Cloner le dépôt officiel</strong>
                </div>
                <div style={{ marginBottom: "8px", color: colors.accent }}>
                  git clone https://github.com/laramies/theHarvester.git
                </div>
                <div style={{ marginBottom: "16px", color: colors.accent }}>
                  cd theHarvester
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}># Installer les dépendances Python</strong>
                </div>
                <div style={{ marginBottom: "16px", color: colors.accent }}>
                  pip3 install -r requirements.txt
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}># Tester l'installation</strong>
                </div>
                <div style={{ color: colors.accent }}>
                  python3 theHarvester.py -h
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🚀 Commandes essentielles et syntaxe
              </h3>
              <div style={{
                background: colors.bgPrimary,
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: `1px solid ${colors.border}`,
                fontFamily: "monospace",
                fontSize: "0.95rem"
              }}>
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ marginBottom: "8px", color: colors.textSecondary }}>
                    <strong style={{ color: colors.accent }}># Scan complet avec toutes les sources disponibles</strong>
                  </div>
                  <div style={{ color: colors.accent }}>
                    theHarvester -d example.com -b all
                  </div>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ marginBottom: "8px", color: colors.textSecondary }}>
                    <strong style={{ color: colors.accent }}># Sources spécifiques uniquement</strong>
                  </div>
                  <div style={{ color: colors.accent }}>
                    theHarvester -d example.com -b google,bing,linkedin
                  </div>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ marginBottom: "8px", color: colors.textSecondary }}>
                    <strong style={{ color: colors.accent }}># Limiter nombre de résultats (défaut: 500)</strong>
                  </div>
                  <div style={{ color: colors.accent }}>
                    theHarvester -d example.com -b google -l 200
                  </div>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ marginBottom: "8px", color: colors.textSecondary }}>
                    <strong style={{ color: colors.accent }}># Export JSON pour analyse ultérieure</strong>
                  </div>
                  <div style={{ color: colors.accent }}>
                    theHarvester -d example.com -b all -f results.json
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: "8px", color: colors.textSecondary }}>
                    <strong style={{ color: colors.accent }}># Résolution DNS des sous-domaines trouvés</strong>
                  </div>
                  <div style={{ color: colors.accent }}>
                    theHarvester -d example.com -b crtsh -n
                  </div>
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🌐 Sources de données disponibles (-b flag)
              </h3>
              <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                theHarvester supporte plus de 20 sources différentes. Certaines nécessitent une clé API (gratuite ou payante) :
              </p>
              <div style={{
                background: colors.bgPrimary,
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px", color: colors.textSecondary, fontSize: "0.95rem" }}>
                  <div><strong style={{ color: colors.accent }}>google</strong></div>
                  <div>Moteur de recherche Google (requêtes site:domain.com)</div>
                  <div><strong style={{ color: colors.accent }}>bing</strong></div>
                  <div>Moteur de recherche Bing Microsoft</div>
                  <div><strong style={{ color: colors.accent }}>baidu</strong></div>
                  <div>Moteur chinois (utile pour cibles asiatiques)</div>
                  <div><strong style={{ color: colors.accent }}>linkedin</strong></div>
                  <div>Profils LinkedIn indexés par Google</div>
                  <div><strong style={{ color: colors.accent }}>twitter</strong></div>
                  <div>Tweets et profils mentionnant le domaine</div>
                  <div><strong style={{ color: colors.accent }}>shodan</strong></div>
                  <div>Base IoT/serveurs Shodan (clé API requise)</div>
                  <div><strong style={{ color: colors.accent }}>censys</strong></div>
                  <div>Base certificats Censys (clé API requise)</div>
                  <div><strong style={{ color: colors.accent }}>hunter</strong></div>
                  <div>Base emails Hunter.io (clé API requise)</div>
                  <div><strong style={{ color: colors.accent }}>certspotter</strong></div>
                  <div>Certificats SSL/TLS Certificate Transparency</div>
                  <div><strong style={{ color: colors.accent }}>crtsh</strong></div>
                  <div>Base crt.sh (certificats SSL publics)</div>
                  <div><strong style={{ color: colors.accent }}>virustotal</strong></div>
                  <div>VirusTotal passive DNS (clé API requise)</div>
                  <div><strong style={{ color: colors.accent }}>threatcrowd</strong></div>
                  <div>ThreatCrowd threat intelligence</div>
                  <div><strong style={{ color: colors.accent }}>dnsdumpster</strong></div>
                  <div>DNSDumpster (sous-domaines et DNS mapping)</div>
                  <div><strong style={{ color: colors.accent }}>github-code</strong></div>
                  <div>Recherche dans le code GitHub public</div>
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                📋 Options principales de ligne de commande
              </h3>
              <div style={{
                background: colors.bgPrimary,
                padding: "20px",
                borderRadius: "8px",
                border: `1px solid ${colors.border}`,
                fontFamily: "monospace",
                fontSize: "0.9rem"
              }}>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>-d DOMAIN</strong> → Domaine cible à analyser (obligatoire)
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>-b SOURCE</strong> → Source(s) à interroger (google, all, etc.)
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>-l LIMIT</strong> → Limite de résultats par source (défaut: 500)
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>-f FILENAME</strong> → Exporter résultats (JSON, XML, HTML)
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>-n</strong> → Activer résolution DNS des sous-domaines
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>-c</strong> → Effectuer brute-force DNS sur patterns (lent)
                </div>
                <div style={{ color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>-s</strong> → Scanner Shodan pour IPs trouvées (clé API)
                </div>
              </div>
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                💡 Exercices Pratiques Professionnels
              </h2>

              <div style={{
                background: colors.bgPrimary,
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "20px",
                border: `1px solid ${colors.border}`
              }}>
                <h3 style={{ color: colors.accent, fontSize: "1.4rem", marginBottom: "15px" }}>
                  Exercice 1 : Collecte exhaustive d'emails d'entreprise
                </h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                  <strong>Objectif :</strong> Constituer une base complète de toutes les adresses email publiques associées à une entreprise cible pour évaluer l'exposition et préparer des tests de phishing.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Commande de base :</strong></p>
                <code style={{
                  background: colors.bgSecondary,
                  padding: "12px 16px",
                  borderRadius: "8px",
                  display: "block",
                  color: colors.accent,
                  marginBottom: "15px",
                  fontFamily: "monospace"
                }}>
                  theHarvester -d company.com -b google,bing,linkedin,hunter -l 1000 -f emails_company.json
                </code>
                <div style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <p style={{ marginBottom: "12px" }}><strong style={{ color: colors.accent }}>Analyse post-collecte :</strong></p>
                  <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
                    <li>Ouvrir le fichier JSON et extraire la liste unique d'emails (éliminer doublons)</li>
                    <li>Identifier le pattern email dominant de l'entreprise (prenom.nom@, p.nom@, prenom_nom@, info@, support@)</li>
                    <li>Compter le nombre total d'emails uniques découverts</li>
                    <li>Classer les emails par catégorie : personnels (prenom.nom@), génériques (contact@, info@, sales@), départements (hr@, tech@, marketing@)</li>
                    <li>Vérifier la validité réelle des emails trouvés avec des outils complémentaires (Hunter.io Email Verifier, Email-Checker.net)</li>
                    <li>Croiser avec LinkedIn pour identifier les personnes derrière les emails personnels</li>
                  </ul>
                  <p style={{ margin: 0 }}>
                    <strong>Livrable attendu :</strong> Base de données structurée (CSV/Excel) : Email | Pattern détecté | Catégorie | Statut validation | Personne identifiée (si applicable).
                  </p>
                </div>
              </div>

              <div style={{
                background: colors.bgPrimary,
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "20px",
                border: `1px solid ${colors.border}`
              }}>
                <h3 style={{ color: colors.accent, fontSize: "1.4rem", marginBottom: "15px" }}>
                  Exercice 2 : Cartographie complète des sous-domaines
                </h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                  <strong>Objectif :</strong> Découvrir l'intégralité des sous-domaines actifs et inactifs d'une organisation pour cartographier précisément sa surface d'attaque.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Commande multi-sources :</strong></p>
                <code style={{
                  background: colors.bgSecondary,
                  padding: "12px 16px",
                  borderRadius: "8px",
                  display: "block",
                  color: colors.accent,
                  marginBottom: "15px",
                  fontFamily: "monospace"
                }}>
                  theHarvester -d target.com -b crtsh,certspotter,dnsdumpster,virustotal -n -f subdomains_target.json
                </code>
                <div style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <p style={{ marginBottom: "12px" }}><strong style={{ color: colors.accent }}>Analyse approfondie :</strong></p>
                  <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
                    <li><strong>Catégorisation fonctionnelle :</strong> Identifier sous-domaines par usage (admin.*, vpn.*, dev.*, staging.*, prod.*, api.*, mail.*, cdn.*, www.*)</li>
                    <li><strong>Test d'accessibilité :</strong> Vérifier accessibilité HTTP/HTTPS avec curl ou httpx : <code style={{ background: colors.bgSecondary, padding: "2px 6px", borderRadius: "4px" }}>for sub in $(cat subs.txt); do curl -I https://$sub 2&gt;/dev/null | grep "HTTP"; done</code></li>
                    <li><strong>Résolution DNS :</strong> Résoudre toutes les IPs avec host ou dig pour mapper infrastructure réseau</li>
                    <li><strong>Détection de sous-domaines sensibles :</strong> Repérer admin.target.com, panel.target.com, internal.target.com, backup.target.com, test.target.com</li>
                    <li><strong>Identification d'environnements oubliés :</strong> Détecter old.target.com, legacy.target.com, archive.target.com potentiellement obsolètes et vulnérables</li>
                    <li><strong>Analyse de l'infrastructure :</strong> Documenter mail.*, smtp.*, imap.* (serveurs mail), ns1.*, ns2.* (DNS), cdn.*, static.* (distribution contenu)</li>
                  </ul>
                  <p style={{ margin: 0 }}>
                    <strong>Rapport final :</strong> Tableau récapitulatif : Sous-domaine | IP résolue | Port(s) ouvert(s) | Service détecté | Niveau de criticité (High/Medium/Low) | Recommandations sécurité.
                  </p>
                </div>
              </div>

              <div style={{
                background: colors.bgPrimary,
                padding: "25px",
                borderRadius: "12px",
                border: `1px solid ${colors.border}`
              }}>
                <h3 style={{ color: colors.accent, fontSize: "1.4rem", marginBottom: "15px" }}>
                  Exercice 3 : Intelligence sur les employés et organigramme
                </h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                  <strong>Objectif :</strong> Extraire systématiquement les noms d'employés, leurs fonctions et reconstituer partiellement l'organigramme de l'entreprise cible.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Commande combinée :</strong></p>
                <code style={{
                  background: colors.bgSecondary,
                  padding: "12px 16px",
                  borderRadius: "8px",
                  display: "block",
                  color: colors.accent,
                  marginBottom: "15px",
                  fontFamily: "monospace"
                }}>
                  theHarvester -d company.com -b google,linkedin,github-code -f employees_intel.json
                </code>
                <div style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <p style={{ marginBottom: "12px" }}><strong style={{ color: colors.accent }}>Processus de traitement des données :</strong></p>
                  <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
                    <li><strong>Extraction noms depuis JSON :</strong> Parser le fichier JSON pour extraire tous les noms de personnes identifiés</li>
                    <li><strong>Enrichissement LinkedIn :</strong> Rechercher manuellement chaque nom sur LinkedIn pour confirmer employé actuel, identifier poste exact, département, ancienneté</li>
                    <li><strong>Analyse métadonnées documents :</strong> Si documents PDF/DOCX trouvés, extraire métadonnées Auteur avec exiftool : <code style={{ background: colors.bgSecondary, padding: "2px 6px", borderRadius: "4px" }}>exiftool -Author document.pdf</code></li>
                    <li><strong>Croisement avec emails :</strong> Associer noms trouvés avec emails collectés précédemment selon pattern identifié (prenom.nom@company.com)</li>
                    <li><strong>Construction de l'organigramme :</strong> Créer structure hiérarchique : C-level (CEO, CTO, CISO) → VP/Directors → Managers → Individual Contributors</li>
                  </ul>
                  <p style={{ marginBottom: "12px" }}><strong style={{ color: colors.accent }}>Base de données finale :</strong></p>
                  <p style={{ marginBottom: "0" }}>
                    Tableau structuré : Nom complet | Email probable | Poste actuel | Département | Niveau hiérarchique | Manager identifié | Profil LinkedIn | Source découverte (theHarvester Google/LinkedIn/GitHub).
                  </p>
                </div>
                <div style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "#ef444420",
                  border: "2px solid #ef4444",
                  borderRadius: "8px"
                }}>
                  <p style={{ color: "#ef4444", fontWeight: "600", marginBottom: "8px" }}>
                    ⚠️ USAGE ÉTHIQUE UNIQUEMENT
                  </p>
                  <p style={{ color: colors.textSecondary, lineHeight: "1.7", margin: 0 }}>
                    Ces informations doivent être utilisées EXCLUSIVEMENT dans le cadre d'audits de sécurité autorisés par contrat écrit, ou pour des campagnes de sensibilisation internes à votre propre organisation. Toute utilisation malveillante (phishing non autorisé, usurpation d'identité, harcèlement) constitue un délit pénal passible de poursuites judiciaires et d'emprisonnement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                🎯 Quiz de validation des connaissances
              </h2>
              <p style={{ color: colors.textSecondary, marginBottom: "30px", lineHeight: "1.7" }}>
                Répondez aux 5 questions suivantes pour valider votre maîtrise du module. Un score minimum de <strong>4/5</strong> est requis pour débloquer le badge Expert theHarvester.
              </p>

              {quizQuestions.map((q, index) => (
                <div
                  key={q.id}
                  style={{
                    background: colors.bgPrimary,
                    padding: "20px",
                    borderRadius: "12px",
                    marginBottom: "20px",
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <h3 style={{
                    color: colors.textPrimary,
                    fontSize: "1.1rem",
                    marginBottom: "15px",
                    fontWeight: "600"
                  }}>
                    {index + 1}. {q.question}
                  </h3>
                  {q.options.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      style={{
                        display: "block",
                        padding: "12px 15px",
                        marginBottom: "10px",
                        background: quizAnswers[q.id] === optIndex.toString()
                          ? colors.accent + "30"
                          : colors.bgSecondary,
                        border: `2px solid ${
                          quizAnswers[q.id] === optIndex.toString()
                            ? colors.accent
                            : colors.border
                        }`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (quizAnswers[q.id] !== optIndex.toString()) {
                          e.currentTarget.style.borderColor = colors.accent;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (quizAnswers[q.id] !== optIndex.toString()) {
                          e.currentTarget.style.borderColor = colors.border;
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={optIndex}
                        checked={quizAnswers[q.id] === optIndex.toString()}
                        onChange={(e) =>
                          setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })
                        }
                        style={{ marginRight: "10px" }}
                      />
                      <span style={{ color: colors.textPrimary, fontSize: "1rem" }}>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              ))}

              <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                  style={{
                    padding: "15px 40px",
                    background:
                      Object.keys(quizAnswers).length === quizQuestions.length
                        ? colors.accent
                        : colors.border,
                    color: "#020617",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor:
                      Object.keys(quizAnswers).length === quizQuestions.length
                        ? "pointer"
                        : "not-allowed",
                    transition: "all 0.3s ease",
                    opacity:
                      Object.keys(quizAnswers).length === quizQuestions.length ? 1 : 0.5,
                  }}
                >
                  ✅ Valider mes réponses
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  style={{
                    padding: "15px 40px",
                    background: "#0b0f1a",
                    color: "#00ff9c",
                    border: "2px solid #00ff9c",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#00ff9c";
                    e.currentTarget.style.color = "#0b0f1a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0b0f1a";
                    e.currentTarget.style.color = "#00ff9c";
                  }}
                >
                  🔄 Réinitialiser le module
                </button>
              </div>

              {showResults && (
                <div
                  style={{
                    marginTop: "30px",
                    padding: "25px",
                    background:
                      getScore() >= 4 ? colors.accent + "20" : "#ef444420",
                    border: `2px solid ${getScore() >= 4 ? colors.accent : "#ef4444"}`,
                    borderRadius: "12px",
                  }}
                >
                  <h3
                    style={{
                      color: getScore() >= 4 ? colors.accent : "#ef4444",
                      fontSize: "1.5rem",
                      marginBottom: "10px",
                      fontWeight: "700",
                    }}
                  >
                    {getScore() >= 4
                      ? "✅ Quiz validé avec succès !"
                      : "❌ Score insuffisant"}
                  </h3>
                  <p
                    style={{
                      color: colors.textPrimary,
                      fontSize: "1.2rem",
                      marginBottom: getScore() >= 4 ? "10px" : "0",
                      fontWeight: "600",
                    }}
                  >
                    Votre score : {getScore()}/{quizQuestions.length}
                  </p>
                  {getScore() >= 4 && (
                    <p style={{ color: colors.textSecondary, fontSize: "1rem", margin: 0 }}>
                      🏆 Félicitations ! Vous avez débloqué le badge <strong>Expert theHarvester</strong>. Vous maîtrisez maintenant la collecte OSINT automatisée.
                    </p>
                  )}
                  {getScore() < 4 && (
                    <p style={{ color: colors.textSecondary, fontSize: "1rem", margin: 0 }}>
                      Révisez les sections Théorie et Outils avant de retenter le quiz.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showResetModal && (
        <>
          <div
            onClick={() => setShowResetModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.8)",
              zIndex: 9998,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#0b0f1a",
              border: "3px solid #00ff9c",
              borderRadius: "12px",
              padding: "40px",
              maxWidth: "500px",
              width: "90%",
              zIndex: 9999,
            }}
          >
            <h3
              style={{
                color: "#00ff9c",
                fontSize: "1.5rem",
                marginBottom: "15px",
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              ⚠️ Réinitialiser le module
            </h3>
            <p
              style={{
                color: "#9ca3af",
                marginBottom: "30px",
                textAlign: "center",
                lineHeight: "1.6",
              }}
            >
              Cette action effacera définitivement toutes vos réponses, votre progression et votre badge dans ce module. Êtes-vous sûr de vouloir continuer ?
            </p>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button
                onClick={() => setShowResetModal(false)}
                style={{
                  padding: "12px 30px",
                  background: "transparent",
                  color: "#9ca3af",
                  border: "2px solid #2a3f3f",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#00ff9c";
                  e.currentTarget.style.color = "#00ff9c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2a3f3f";
                  e.currentTarget.style.color = "#9ca3af";
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: "12px 30px",
                  background: "#00ff9c",
                  color: "#0b0f1a",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#00d68f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#00ff9c";
                }}
              >
                Confirmer la réinitialisation
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
