import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (labels, emissions, labelTitle) => {
  if (labels.length === 0 || emissions.length === 0) {
    alert("No hay datos para exportar");
    return;
  }

  const fecha = new Date().toLocaleDateString();

  const data = [
    ["Reporte de Emisiones de CO₂", ""],
    [`Generado el ${fecha}`, ""],
    [],
    [labelTitle, "Emisiones (kg CO₂)"],
    ...labels.map((label, index) => [label, emissions[index]])
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet["!cols"] = [{ wch: 24 }, { wch: 20 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const file = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(file, "reporte_emisiones.xlsx");
};