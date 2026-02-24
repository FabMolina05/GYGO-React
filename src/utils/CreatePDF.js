import { jsPDF } from "jspdf";

export async function CreatePDF(datos) {
  const proyectosMap = new Map();

  datos.forEach((item) => {
    if (!proyectosMap.has(item.proyectoId)) {
      // Creamos el proyecto con la estructura base y un array vacío de tareas
      proyectosMap.set(item.proyectoId, {
        proyectoId: item.proyectoId,
        grupoNombre: item.grupoNombre,
        logoUrl: item.logoUrl,
        projectNombre: item.projectNombre,
        projectDescripcion: item.projectDescripcion,
        projectUnidadNombre: item.projectUnidadNombre,
        projectCantidadReduccion: item.projectCantidadReduccion,
        fechaInicio: item.fechaInicio,
        fechaFinal: item.fechaFinal,
        projectEstatus: item.projectEstatus,
        tasks: [],
      });
    }
    // Agregamos la tarea al array de tareas del proyecto
    proyectosMap.get(item.proyectoId).tasks.push({
      taskNombre: item.taskNombre,
      taskDescripcion: item.taskDescripcion,
      taskEstatus: item.taskEstatus,
      taskValorActividad: item.taskValorActividad,
      taskFactorEmision: item.taskFactorEmision,
      taskEmisiones: item.taskEmisiones,
    });
  });

  async function getBase64FromUrl(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se pudo cargar la imagen");
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Convertimos el Map a array
  const proyectos = Array.from(proyectosMap.values());
  
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  const nombreArchivo = `Proyectos_${dia}-${mes}-${año}.pdf`;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const borderRadius = 10;

  // Portada
  doc.setFillColor(56, 71, 69);
  doc.roundedRect(
    0,
    0,
    pageWidth,
    pageHeight * 0.6,
    borderRadius,
    borderRadius,
    "F"
  );

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(50);
  doc.setFont("helvetica", "bold");

  const texto = ["Informe:", "Proyectos"];
  let y = 40;
  texto.forEach((linea) => {
    const textWidth = doc.getTextWidth(linea);
    doc.text(linea, (pageWidth - textWidth) / 2, y);
    y += 20;
  });

  doc.setFontSize(18);
  doc.setTextColor(112, 90, 90);
  doc.setFont("helvetica", "normal");
  doc.text(proyectos[0].grupoNombre, 20, pageHeight * 0.65);
  doc.text(`Año ${año}`, 20, pageHeight * 0.67 + 6);
  doc.text("Preparado por:", 20, pageHeight - 40);
  doc.text("Preparado para:", pageWidth - 60, pageHeight - 40);

  doc.setFontSize(10);
  const logoGYGO = await getBase64FromUrl("/logoPdf.png");
  doc.addImage(logoGYGO, "PNG", 8, pageHeight - 49, 60, 60);

  // Inserta logo de la empresa en portada
  if (proyectos[0].logoUrl) {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const logoEmpresa = await getBase64FromUrl(
        baseUrl + proyectos[0].logoUrl
      );
      doc.addImage(logoEmpresa, "PNG", pageWidth - 60, pageHeight - 25, 40, 15);
    } catch (error) {
      console.warn("No se pudo cargar el logo en la portada:", error);
    }
  }

  // Ahora iteramos proyectos agrupados
  proyectos.forEach((data, index) => {
    doc.addPage();

    // Título página
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`Detalle del Proyecto #${index + 1}`, 20, 20);

    doc.setDrawColor(56, 71, 69);
    doc.setLineWidth(1.5);
    doc.line(20, 25, pageWidth - 20, 25);

    let yy = 35;
    const leftMargin = 20;
    const maxHeight = pageHeight - 20;
    const lineHeight = 7;
    const labelColor = [56, 71, 69];

    function checkPageBreak(heightNeeded) {
      if (yy + heightNeeded > maxHeight) {
        doc.addPage();
        yy = 20;
      }
    }

    // Título Proyecto
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...labelColor);
    doc.text("Proyecto", leftMargin, yy);
    yy += lineHeight + 2;

    // Información del proyecto
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const proyectoInfo = [
      { label: "Nombre", value: data.projectNombre || "-" },
      { label: "Descripción", value: data.projectDescripcion || "-" },
      {
        label: "Estado",
        value: data.projectEstatus ? "Realizado" : "Pendiente",
      },
      { label: "Fecha de inicio", value: data.fechaInicio || "-" },
      { label: "Fecha final", value: data.fechaFinal || "-" },
    ];

    proyectoInfo.forEach((info) => {
      checkPageBreak(lineHeight);
      doc.text(`${info.label}: ${info.value}`, leftMargin, yy);
      yy += lineHeight;
    });

    // Separador visual
    yy += 6;
    checkPageBreak(10);
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yy, pageWidth - leftMargin, yy);
    yy += 10;

    // Tareas
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...labelColor);
    doc.text("Actividades", leftMargin, yy);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    yy += 8;

    if (Array.isArray(data.tasks) && data.tasks.length > 0) {
      data.tasks.forEach((task, i) => {
        // Calcular altura necesaria para esta tarea
        const descripcionWidth = (pageWidth - 2 * leftMargin) * 0.58;
        const descripcionSplit = doc.splitTextToSize(
          task.taskDescripcion || "Sin descripción",
          descripcionWidth - 15
        );
        const alturaDescripcion = descripcionSplit.length * 5;
        const alturaTarea = Math.max(42, 25 + alturaDescripcion);
        
        // Verificar si necesitamos nueva página
        if (yy + alturaTarea + 10 > maxHeight) {
          doc.addPage();
          yy = 20;
          
          // Encabezado de continuación
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...labelColor);
          doc.text(`${data.projectNombre} - Actividades (continuación)`, leftMargin, yy);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
          yy += 10;
        }

        // Fondo alternado para cada tarea
        if (i % 2 === 0) {
          doc.setFillColor(248, 249, 250);
          doc.roundedRect(leftMargin - 2, yy - 3, pageWidth - 2 * leftMargin + 4, alturaTarea, 2, 2, 'F');
        }

        // Título de la tarea con número
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(56, 71, 69);
        const tituloTarea = `${i + 1}. ${task.taskNombre || "Sin nombre"}`;
        doc.text(tituloTarea, leftMargin + 3, yy + 4);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        
        // COLUMNA IZQUIERDA - Descripción
        const descripcionX = leftMargin + 3;
        
        doc.setFont("helvetica", "bold");
        doc.text("Descripción:", descripcionX, yy + 11);
        doc.setFont("helvetica", "normal");
        
        let descY = yy + 16;
        descripcionSplit.forEach(linea => {
          doc.text(linea, descripcionX + 3, descY);
          descY += 5;
        });

        // COLUMNA DERECHA - Datos numéricos
        const datosX = leftMargin + descripcionWidth + 5;
        const labelWidth = 30;
        let datosY = yy + 11;
        
        // Valor Actividad
        doc.setFont("helvetica", "bold");
        doc.text("Valor Actividad:", datosX, datosY);
        doc.setFont("helvetica", "normal");
        const valorText = String(task.taskValorActividad ?? "N/A");
        const valorTruncado = doc.splitTextToSize(valorText, 32);
        doc.text(valorTruncado[0], datosX + labelWidth, datosY);
        datosY += 6;
        
        // Factor Emisión
        doc.setFont("helvetica", "bold");
        doc.text("Factor Emisión:", datosX, datosY);
        doc.setFont("helvetica", "normal");
        const factorText = String(task.taskFactorEmision ?? "N/A");
        const factorTruncado = doc.splitTextToSize(factorText, 32);
        doc.text(factorTruncado[0], datosX + labelWidth, datosY);
        datosY += 6;
        
        // Emisiones CO2
        doc.setFont("helvetica", "bold");
        doc.text("CO2:", datosX, datosY);
        doc.setFont("helvetica", "normal");
        const emisionText = `${task.taskEmisiones ?? "N/A"} ${data.projectUnidadNombre || ""}`;
        const emisionTruncado = doc.splitTextToSize(emisionText, 32);
        doc.text(emisionTruncado[0], datosX + labelWidth, datosY);
        datosY += 6;
        
        // Estado con badge visual
        doc.setFont("helvetica", "bold");
        doc.text("Estado:", datosX, datosY);
        doc.setFont("helvetica", "normal");
        
        const estado = task.taskEstatus ? "Realizado" : "Pendiente";
        const estadoX = datosX + labelWidth;
        
        // Badge de fondo
        const badgeWidth = doc.getTextWidth(estado) + 4;
        if (task.taskEstatus) {
          doc.setFillColor(220, 252, 231); // Verde claro
          doc.setTextColor(21, 128, 61); // Verde oscuro
        } else {
          doc.setFillColor(254, 243, 199); // Amarillo claro
          doc.setTextColor(180, 83, 9); // Naranja oscuro
        }
        doc.roundedRect(estadoX - 1, datosY - 4, badgeWidth, 6, 1, 1, 'F');
        doc.text(estado, estadoX + 1, datosY);
        doc.setTextColor(0, 0, 0); // Restaurar color

        // Avanzar al final de la tarea
        yy += alturaTarea;

        // Línea separadora entre tareas (excepto la última)
        if (i < data.tasks.length - 1) {
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.2);
          doc.line(leftMargin, yy + 1, pageWidth - leftMargin, yy + 1);
          yy += 3;
        }
      }); // ← Cierra forEach de tasks
    } else {
      doc.setFillColor(255, 243, 205);
      doc.roundedRect(leftMargin, yy - 2, pageWidth - 2 * leftMargin, 10, 2, 2, 'F');
      doc.setTextColor(146, 64, 14);
      doc.text("⚠ No hay actividades registradas para este proyecto", leftMargin + 5, yy + 4);
      doc.setTextColor(0, 0, 0);
      yy += 12;
    }

    // Espacio final antes del siguiente proyecto
    yy += 10;
  }); // ← Cierra forEach de proyectos

  doc.save(nombreArchivo);
}