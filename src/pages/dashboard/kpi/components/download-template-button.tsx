"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function DownloadTemplateButton() {
  const handleDownload = () => {
    const headers = [
      "TIPO IESS", "MES 1", "MES 2", "FECHA ENTRADA SALIDA", "AÑO", 
      "CEDULA", "NOMBRE", "SUELDO", "KPI", "TIPO DE CONTRATO", 
      "MOVILIZACION - EXTRAS NOGRAB", "REINGRESO", "DIAS DE ARRANQUE", 
      "DETALLE", "CARGO/ACTIVIDAD", "Grupo de Centros de Costos", 
      "Centro Costos N1", "Centro Costos N2", "REGISTRO DE AVISO ENTRADA/SALIDAIESS", 
      "Fecha Legalización Contrato", "Fecha Tope", "AUTORIZACION 1", "AUTORIZACION 2"
    ].join(";");
    
    const blob = new Blob([headers], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "headcount_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Descargar plantilla
    </Button>
  );
}