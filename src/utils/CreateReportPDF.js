import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const exportChartToPDF = (chartRef, labels, emissions, labelTitle) => {
  const chart = chartRef.current;

  if (!chart) {
    alert("No hay gráfico para exportar");
    return;
  }
  const fecha = new Date().toLocaleDateString();
  const chartInstance = chart.chartInstance || chart;

  const base64Image = chartInstance.toBase64Image();
  const pdf = new jsPDF();
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(20);
  pdf.text("Reporte de Emisiones de CO2", 15, 20);

  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(`Generado el ${fecha}`, 15, 28);

  pdf.setDrawColor(150);
  pdf.line(15, 32, pdfWidth - 15, 32);

  const imgProps = pdf.getImageProperties(base64Image);
  const imgWidth = pdfWidth - 30;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
  pdf.addImage(base64Image, "PNG", 15, 40, imgWidth, imgHeight);


  const tableData = labels.map((label, index) => [
    label,
    emissions[index].toFixed(2)
  ]);

  autoTable(pdf, {
    startY: 40 + imgHeight + 10,
    head: [[labelTitle, "Emisiones (kg CO2)"]],
    body: tableData,
    styles: {
      halign: "center"
    },
    headStyles: {
      fillColor: [41, 128, 185]
    }
  });

  pdf.setFontSize(9);
  pdf.setTextColor(120);
  pdf.text("Sistema de Huella de Carbono - GYGO", 15, pdfHeight - 10);
  pdf.save("reporte_emisiones.pdf");
};