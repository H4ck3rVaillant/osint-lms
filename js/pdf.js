function generatePDF() {
  const element = document.getElementById("rapport");
  html2pdf().from(element).save("rapport_osint_client.pdf");
}
