"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { parse, ParseResult } from "papaparse";
import { toast } from "sonner";
import { DiffViewerModal } from "./diff-viewer-modal";
import { useHeadcount } from "@/hooks/use-headcount";
import axios from "axios";
import { Headcount } from "@/types/headcount";

interface CSVData {
  "TIPO IESS"?: string;
  "MES 1"?: string;
  "MES 2"?: string;
  "FECHA ENTRADA SALIDA"?: string;
  "AÑO"?: string;
  "CEDULA"?: string;
  "NOMBRE"?: string;
  "SUELDO"?: string | number;
  "KPI"?: string | number;
  "TIPO DE CONTRATO"?: string;
  "MOVILIZACION - EXTRAS NOGRAB"?: string;
  "REINGRESO"?: string;
  "DIAS DE ARRANQUE"?: string;
  "DETALLE"?: string;
  "CARGO/ACTIVIDAD"?: string;
  "Grupo de Centros de Costos"?: string;
  "Centro Costos N1"?: string;
  "Centro Costos N2"?: string;
  "REGISTRO DE AVISO ENTRADA/SALIDAIESS"?: string;
  "Fecha Legalización Contrato"?: string;
  "Fecha Tope"?: string;
  "AUTORIZACION 1"?: string;
  "AUTORIZACION 2"?: string;
}

export function ImportCSVButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [diffData, setDiffData] = useState<{
    oldData: Headcount[];
    newData: CSVData[];
  } | null>(null);
  const { data: currentData } = useHeadcount();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      parse(file, {
        header: true,
        complete: (results: ParseResult<CSVData>) => {
            const processedData = results.data.map(item => ({
              ...item,
              id: item.CEDULA || Math.random().toString(), 
              SUELDO: item.SUELDO ? Number(item.SUELDO) : 0,
              KPI: item.KPI ? Number(item.KPI) : 0
            }));
            
            setDiffData({
              oldData: currentData || [],
              newData: processedData,
            });
          },
        error: (error: Error) => {
          toast.error(`Error al parsear el CSV: ${error.message}`);
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error al procesar el archivo: ${error.message}`);
      } else {
        toast.error("Error desconocido al procesar el archivo");
      }
    }
  };

  const handleCommit = async (commitMessage: string) => {
    if (!diffData) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      await axios.post('http://localhost:3000/headcount/commits', {
        oldData: diffData.oldData,
        newData: diffData.newData,
        message: commitMessage
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success("El commit está pendiente de segunda autorización");
      setDiffData(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error al crear el commit: ${error.message}`);
      } else {
        toast.error("Error desconocido al crear el commit");
      }
    }
  };

  return (
    <>
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
      >
        <Upload className="mr-2 h-4 w-4" />
        Importar CSV
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />

      {diffData && (
        <DiffViewerModal
          oldData={diffData.oldData}
          newData={diffData.newData}
          onCommit={handleCommit}
          onOpenChange={(open) => !open && setDiffData(null)}
        />
      )}
    </>
  );
}