// Générateur de certificat PDF - Design diplôme universitaire geek (fond clair)

interface CertificateData {
  username: string;
  dateDebut: string;
  dateFin: string;
}

// Charger jsPDF dynamiquement
async function loadJsPDF(): Promise<any> {
  if (typeof (window as any).jspdf !== 'undefined') {
    return (window as any).jspdf.jsPDF;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    
    script.onload = () => {
      if (typeof (window as any).jspdf !== 'undefined') {
        resolve((window as any).jspdf.jsPDF);
      } else {
        reject(new Error('jsPDF failed to load'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load jsPDF script'));
    };
    
    document.head.appendChild(script);
  });
}

export async function generateCertificate(data: CertificateData): Promise<void> {
  try {
    const jsPDF = await loadJsPDF();

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 297;
    const pageHeight = 210;

    // ========== FOND BLANC ==========
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // ========== FILIGRANE "CyberOSINT" en diagonale ==========
    pdf.setTextColor(240, 240, 240);
    pdf.setFontSize(60);
    pdf.setFont('helvetica', 'bold');
    
    // Filigrane répété
    for (let i = 0; i < 5; i++) {
      const y = 40 + (i * 50);
      pdf.text('CyberOSINT', pageWidth / 2 - 100 + (i * 30), y, { 
        angle: 45,
        align: 'center' 
      });
    }

    // ========== BORDURES DÉCORATIVES ==========
    // Bordure extérieure verte
    pdf.setDrawColor(0, 255, 156);
    pdf.setLineWidth(3);
    pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);

    // Bordure intérieure fine
    pdf.setDrawColor(50, 50, 50);
    pdf.setLineWidth(0.5);
    pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Coins décoratifs (style universitaire)
    const cornerSize = 15;
    pdf.setDrawColor(0, 255, 156);
    pdf.setLineWidth(2);
    
    // Coin haut gauche
    pdf.line(15, 15, 15 + cornerSize, 15);
    pdf.line(15, 15, 15, 15 + cornerSize);
    
    // Coin haut droit
    pdf.line(pageWidth - 15, 15, pageWidth - 15 - cornerSize, 15);
    pdf.line(pageWidth - 15, 15, pageWidth - 15, 15 + cornerSize);
    
    // Coin bas gauche
    pdf.line(15, pageHeight - 15, 15 + cornerSize, pageHeight - 15);
    pdf.line(15, pageHeight - 15, 15, pageHeight - 15 - cornerSize);
    
    // Coin bas droit
    pdf.line(pageWidth - 15, pageHeight - 15, pageWidth - 15 - cornerSize, pageHeight - 15);
    pdf.line(pageWidth - 15, pageHeight - 15, pageWidth - 15, pageHeight - 15 - cornerSize);

    // ========== LOGO STYLISÉ (texte ASCII art) ==========
    pdf.setFontSize(24);
    pdf.setFont('courier', 'bold');
    pdf.setTextColor(0, 255, 156);
    pdf.text('< CYBER/OSINT >', pageWidth / 2, 30, { align: 'center' });

    // ========== NOM ACADEMY ==========
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(50, 50, 50);
    pdf.text('CyberOSINT Academy', pageWidth / 2, 40, { align: 'center' });

    // Ligne décorative sous le titre
    pdf.setDrawColor(0, 255, 156);
    pdf.setLineWidth(1);
    pdf.line(100, 44, pageWidth - 100, 44);

    // ========== TITRE CERTIFICAT ==========
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 30, 30);
    pdf.text('CERTIFICAT DE COMPLÉTION', pageWidth / 2, 58, { align: 'center' });

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text('Programme de Formation OSINT', pageWidth / 2, 66, { align: 'center' });

    // ========== MENTION IMPORTANTE ==========
    pdf.setFontSize(7);
    pdf.setTextColor(120, 120, 120);
    pdf.setFont('helvetica', 'italic');
    pdf.text('(Document de suivi de formation sans valeur de certification officielle)', pageWidth / 2, 72, { align: 'center' });

    // ========== "DÉCERNÉ À" ==========
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Ce certificat est décerné à', pageWidth / 2, 86, { align: 'center' });

    // ========== NOM UTILISATEUR ==========
    pdf.setFontSize(36);
    pdf.setFont('times', 'bolditalic');
    pdf.setTextColor(0, 180, 120); // Vert un peu plus foncé pour lisibilité
    pdf.text(data.username, pageWidth / 2, 102, { align: 'center' });

    // Ligne sous le nom (style signature)
    pdf.setDrawColor(0, 255, 156);
    pdf.setLineWidth(0.5);
    pdf.line(pageWidth / 2 - 70, 106, pageWidth / 2 + 70, 106);

    // ========== TEXTE DESCRIPTIF ==========
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    
    const text1 = 'pour avoir complété avec succès l\'intégralité du programme de formation';
    const text2 = 'comprenant les parcours (débutant, intermédiaire, avancé), exercices pratiques,';
    const text3 = 'études de cas réels, quiz d\'évaluation et challenges CTF';
    
    pdf.text(text1, pageWidth / 2, 120, { align: 'center' });
    pdf.text(text2, pageWidth / 2, 128, { align: 'center' });
    pdf.text(text3, pageWidth / 2, 136, { align: 'center' });

    // ========== DATES ==========
    const formatDate = (isoDate: string) => {
      const date = new Date(isoDate);
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
    };

    const dateDebut = formatDate(data.dateDebut);
    const dateFin = formatDate(data.dateFin);

    // Encadré des dates
    pdf.setFillColor(248, 248, 248);
    pdf.setDrawColor(0, 255, 156);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(pageWidth / 2 - 60, 145, 120, 16, 3, 3, 'FD');

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(50, 50, 50);
    pdf.text('Période de formation', pageWidth / 2, 152, { align: 'center' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text(`${dateDebut} au ${dateFin}`, pageWidth / 2, 158, { align: 'center' });

    // ========== SECTION SIGNATURE ==========
    const signatureY = 175;

    // Date d'émission
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Délivré le ${dateFin}`, 40, signatureY - 5);

    // Signature créateur
    pdf.setFontSize(20);
    pdf.setFont('times', 'italic');
    pdf.setTextColor(0, 180, 120);
    pdf.text('H4ck3r Vaillant', pageWidth - 60, signatureY, { align: 'center' });

    // Ligne de signature
    pdf.setDrawColor(0, 255, 156);
    pdf.setLineWidth(0.3);
    pdf.line(pageWidth - 90, signatureY + 3, pageWidth - 30, signatureY + 3);

    // Titre sous signature
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text('Créateur & Formateur', pageWidth - 60, signatureY + 8, { align: 'center' });
    pdf.text('CyberOSINT Academy', pageWidth - 60, signatureY + 13, { align: 'center' });

    // ========== FOOTER ==========
    // Numéro unique de certificat
    const certificateId = btoa(`${data.username}-${data.dateFin}`).substring(0, 12).toUpperCase();
    
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Certificat N° ${certificateId}`, pageWidth / 2, pageHeight - 6, { align: 'center' });

    // Note de validation (style QR code textuel)
    pdf.setFontSize(6);
    pdf.setFont('courier', 'normal');
    pdf.text(`[ Validation: ${certificateId} | cyberosint-academy.com/verify ]`, pageWidth / 2, pageHeight - 3, { align: 'center' });

    // ========== TÉLÉCHARGEMENT ==========
    const fileName = `Certificat_CyberOSINT_${data.username.replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);

    console.log(`✅ Certificat généré: ${fileName}`);
  } catch (error) {
    console.error('Erreur lors de la génération du certificat:', error);
    alert(`Erreur: ${error instanceof Error ? error.message : 'Impossible de générer le certificat'}`);
  }
}

// Fonction de test (debug)
export function testCertificateGeneration() {
  generateCertificate({
    username: "John Doe",
    dateDebut: "2024-01-15T10:00:00.000Z",
    dateFin: "2024-12-20T18:30:00.000Z"
  });
}
