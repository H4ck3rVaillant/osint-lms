// Générateur certificat - Design PARFAIT avec harmonisation logo/fond

interface CertificateData {
  username: string;
  dateDebut: string;
  dateFin: string;
}

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
    
    script.onerror = () => reject(new Error('Failed to load jsPDF script'));
    document.head.appendChild(script);
  });
}

async function loadLogoAsBase64(): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } else {
        reject(new Error('Cannot get canvas context'));
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load logo'));
    img.src = '/Mon_Logo.png';
  });
}

export async function generateCertificate(data: CertificateData): Promise<void> {
  try {
    const jsPDF = await loadJsPDF();
    const logoBase64 = await loadLogoAsBase64();

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 297;
    const pageHeight = 210;

    // ========== FOND BLANC (au lieu de vert clair) ==========
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // ========== LOGO HIBOU EN FILIGRANE CENTRAL ==========
    const logoSize = 140;
    const logoX = (pageWidth - logoSize) / 2;
    const logoY = (pageHeight - logoSize) / 2;
    
    pdf.addImage(logoBase64, 'PNG', logoX, logoY, logoSize, logoSize);

    // ========== BORDURES VERTES (TRIPLE CADRE) ==========
    pdf.setDrawColor(0, 255, 156);
    pdf.setLineWidth(4);
    pdf.rect(6, 6, pageWidth - 12, pageHeight - 12);

    pdf.setDrawColor(30, 30, 30);
    pdf.setLineWidth(1);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

    pdf.setDrawColor(0, 255, 156);
    pdf.setLineWidth(2);
    pdf.rect(14, 14, pageWidth - 28, pageHeight - 28);

    // ========== TITRE "CYBER-OSINT ACADEMY" ==========
    pdf.setFontSize(36);
    pdf.setFont('helvetica', 'bold');
    
    // Effet contour vert
    pdf.setTextColor(0, 200, 120);
    pdf.text('CYBER-OSINT ACADEMY', pageWidth / 2 + 0.5, 35.5, { align: 'center' });
    
    // Texte principal noir
    pdf.setTextColor(30, 30, 30);
    pdf.text('CYBER-OSINT ACADEMY', pageWidth / 2, 35, { align: 'center' });

    // ========== "CERTIFICAT DE COMPLÉTION" ==========
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 30, 30);
    pdf.text('CERTIFICAT DE COMPLÉTION', pageWidth / 2, 50, { align: 'center' });

    // ========== SOUS-TITRES ==========
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(50, 50, 50);
    pdf.text('Programme de formation OSINT', pageWidth / 2, 60, { align: 'center' });

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100);
    pdf.text('(Document de suivi de formation sans valeur de certification officielle)', pageWidth / 2, 67, { align: 'center' });

    // ========== "CE CERTIFICAT EST DÉCERNÉ À" ==========
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(30, 30, 30);
    pdf.text('Ce certificat est décerné à', pageWidth / 2, 85, { align: 'center' });

    // ========== NOM UTILISATEUR (VERT ITALIC) ==========
    pdf.setFontSize(42);
    pdf.setFont('times', 'bolditalic');
    pdf.setTextColor(0, 200, 80);
    pdf.text(data.username, pageWidth / 2, 100, { align: 'center' });

    pdf.setDrawColor(0, 200, 80);
    pdf.setLineWidth(0.8);
    pdf.line(pageWidth / 2 - 80, 104, pageWidth / 2 + 80, 104);

    // ========== TEXTE DESCRIPTION ==========
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(40, 40, 40);
    
    pdf.text('Pour avoir complété avec succès l\'intégralité du programme de formation comprenant les', pageWidth / 2, 120, { align: 'center' });
    pdf.text('parcours (débutant, intermédiaire, avancé), exercices pratiques, études de cas réel, quiz', pageWidth / 2, 127, { align: 'center' });
    pdf.text('d\'évaluation et challenges CTF.', pageWidth / 2, 134, { align: 'center' });

    // ========== ENCADRÉ PÉRIODE (PLUS COURT, TRAIT FIN, FOND TRANSPARENT) ==========
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

    // Encadré plus court (100mm au lieu de 130mm) avec trait fin (0.8 au lieu de 2)
    pdf.setDrawColor(0, 255, 156);
    pdf.setLineWidth(0.8);
    pdf.roundedRect(pageWidth / 2 - 50, 148, 100, 18, 4, 4, 'D'); // 'D' = draw only (pas de fill)

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 30, 30);
    pdf.text('Période de formation', pageWidth / 2, 155, { align: 'center' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`${dateDebut} au ${dateFin}`, pageWidth / 2, 161, { align: 'center' });

    // ========== DATE DÉLIVRANCE (bas gauche) ==========
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(50, 50, 50);
    pdf.text(`Délivré le ${dateFin}`, 25, 185);

    // ========== SIGNATURE (bas droite) ==========
    pdf.setFontSize(22);
    pdf.setFont('times', 'italic');
    pdf.setTextColor(0, 200, 80);
    pdf.text('H4ck3r Vaillant', pageWidth - 60, 180, { align: 'center' });

    pdf.setDrawColor(0, 200, 80);
    pdf.setLineWidth(0.5);
    pdf.line(pageWidth - 90, 183, pageWidth - 30, 183);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(50, 50, 50);
    pdf.text('Créateur', pageWidth - 60, 188, { align: 'center' });
    pdf.text('CyberOSINT Academy', pageWidth - 60, 193, { align: 'center' });

    // ========== NUMÉRO DE CERTIFICAT (FOOTER) ==========
    const certificateId = btoa(`${data.username}-${data.dateFin}`).substring(0, 12).toUpperCase();
    
    pdf.setFontSize(7);
    pdf.setTextColor(120, 120, 120);
    pdf.setFont('courier', 'normal');
    pdf.text(`Certificat N° ${certificateId}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
    
    pdf.setFontSize(6);
    pdf.text(`[ Validation: ${certificateId} | cyberosint-academy.com/verify ]`, pageWidth / 2, pageHeight - 4, { align: 'center' });

    const fileName = `Certificat_CyberOSINT_${data.username.replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);

    console.log(`✅ Certificat généré: ${fileName}`);
  } catch (error) {
    console.error('Erreur lors de la génération du certificat:', error);
    alert(`Erreur: ${error instanceof Error ? error.message : 'Impossible de générer le certificat'}`);
  }
}

export function testCertificateGeneration() {
  generateCertificate({
    username: "Cyber_Admin",
    dateDebut: "2026-01-15T10:00:00.000Z",
    dateFin: "2026-02-20T18:30:00.000Z"
  });
}
