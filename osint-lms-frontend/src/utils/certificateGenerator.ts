// Générateur de certificat PDF avec chargement dynamique de jsPDF

interface CertificateData {
  username: string;
  dateDebut: string;
  dateFin: string;
}

// Charger jsPDF dynamiquement
async function loadJsPDF(): Promise<any> {
  // Vérifier si déjà chargé
  if (typeof (window as any).jspdf !== 'undefined') {
    return (window as any).jspdf.jsPDF;
  }

  // Charger le script
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    
    script.onload = () => {
      // jsPDF est chargé dans window.jspdf.jsPDF
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
    // Charger jsPDF
    const jsPDF = await loadJsPDF();

    // Créer un nouveau document PDF en paysage A4
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 297; // A4 landscape width in mm
    const pageHeight = 210; // A4 landscape height in mm

    // Fond dégradé (simulé avec rectangles)
    pdf.setFillColor(11, 15, 26); // #0b0f1a
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Bordure décorative
    pdf.setDrawColor(0, 255, 156); // Vert menthe
    pdf.setLineWidth(2);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Bordure intérieure
    pdf.setDrawColor(0, 255, 156);
    pdf.setLineWidth(0.5);
    pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Logo/Icône (simulé avec du texte)
    pdf.setFontSize(40);
    pdf.setTextColor(0, 255, 156);
    pdf.text('🛡️', pageWidth / 2, 35, { align: 'center' });

    // Titre "CyberOSINT Academy"
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 255, 156);
    pdf.text('CyberOSINT Academy', pageWidth / 2, 50, { align: 'center' });

    // Ligne décorative
    pdf.setDrawColor(0, 255, 156);
    pdf.setLineWidth(0.5);
    pdf.line(80, 55, pageWidth - 80, 55);

    // "CERTIFICAT DE COMPLÉTION"
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('CERTIFICAT DE COMPLÉTION', pageWidth / 2, 70, { align: 'center' });

    // "DE FORMATION"
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'normal');
    pdf.text('DE FORMATION', pageWidth / 2, 80, { align: 'center' });

    // Mention "Sans valeur de certification"
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('(Sans valeur de certification officielle)', pageWidth / 2, 88, { align: 'center' });

    // "Décerné à"
    pdf.setFontSize(14);
    pdf.setTextColor(200, 200, 200);
    pdf.text('Décerné à', pageWidth / 2, 100, { align: 'center' });

    // Nom de l'utilisateur
    pdf.setFontSize(32);
    pdf.setFont('times', 'bolditalic');
    pdf.setTextColor(0, 255, 156);
    pdf.text(data.username, pageWidth / 2, 115, { align: 'center' });

    // Ligne sous le nom
    pdf.setDrawColor(0, 255, 156);
    pdf.setLineWidth(0.3);
    const nameLineStart = pageWidth / 2 - 60;
    const nameLineEnd = pageWidth / 2 + 60;
    pdf.line(nameLineStart, 118, nameLineEnd, 118);

    // Texte de félicitations
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(200, 200, 200);
    pdf.text('pour avoir complété avec succès l\'ensemble du programme de formation', pageWidth / 2, 130, { align: 'center' });
    pdf.text('comprenant les parcours, exercices, études de cas, quiz et challenges', pageWidth / 2, 138, { align: 'center' });

    // Dates
    const formatDate = (isoDate: string) => {
      const date = new Date(isoDate);
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
    };

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(150, 150, 150);
    
    const dateDebut = formatDate(data.dateDebut);
    const dateFin = formatDate(data.dateFin);
    
    pdf.text(`Période de formation : ${dateDebut} au ${dateFin}`, pageWidth / 2, 152, { align: 'center' });

    // Date d'émission
    pdf.setFontSize(10);
    pdf.setTextColor(120, 120, 120);
    pdf.text(`Délivré le ${dateFin}`, pageWidth / 2, 160, { align: 'center' });

    // Signature
    pdf.setFontSize(18);
    pdf.setFont('times', 'italic');
    pdf.setTextColor(0, 255, 156);
    pdf.text('H4ck3r Vaillant', pageWidth / 2, 180, { align: 'center' });

    // Titre sous signature
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(150, 150, 150);
    pdf.text('Créateur - CyberOSINT Academy', pageWidth / 2, 187, { align: 'center' });

    // Ligne de signature
    pdf.setDrawColor(0, 255, 156);
    pdf.setLineWidth(0.2);
    pdf.line(pageWidth / 2 - 30, 175, pageWidth / 2 + 30, 175);

    // Footer - Numéro unique du certificat (basé sur username + date)
    const certificateId = btoa(`${data.username}-${data.dateFin}`).substring(0, 12).toUpperCase();
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Certificat N° ${certificateId}`, pageWidth / 2, pageHeight - 8, { align: 'center' });

    // Télécharger le PDF
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
