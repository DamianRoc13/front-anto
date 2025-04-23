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
  TIPO_IESS?: string;
  MES_1?: string;
  MES_2?: string;
  FECHA_ENTRADA_SALIDA?: string;
  ANIO?: string;
  CEDULA?: string;
  NOMBRE?: string;
  SUELDO?: string | number;
  KPI?: string | number;
  TIPO_DE_CONTRATO?: string;
  MOVILIZACION_EXTRAS_NOGRAB?: string;
  REINGRESO?: string;
  DIAS_DE_ARRANQUE?: string;
  DETALLE?: string;
  CARGO_ACTIVIDAD?: string;
  GRUPO_DE_CENTROS_DE_COSTOS?: string;
  CENTRO_COSTOS_N1?: string;
  CENTRO_COSTOS_N2?: string;
  REGISTRO_DE_AVISO_ENTRADA_SALIDA_IESS?: string;
  FECHA_LEGALIZACION_CONTRATO?: string;
  FECHA_TOPE?: string;
  AUTORIZACION_1?: string;
  AUTORIZACION_2?: string;
}

export function ImportCSVButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [diffData, setDiffData] = useState<{
    oldData: Headcount[];
    newData: Headcount[];
  } | null>(null);
  const { data: currentData } = useHeadcount();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      parse(file, {
        header: true,
        complete: (results: ParseResult<CSVData>) => {
          const processedData = results.data
            .filter(item => item.CEDULA) // Filtrar filas sin cédula
            .map(item => {
              // Convertir campos numéricos
              const sueldo = item.SUELDO ? 
                typeof item.SUELDO === 'string' ? 
                parseFloat(item.SUELDO.replace(',', '.')) : 
                Number(item.SUELDO) : 0;

              const kpi = item.KPI ? 
                typeof item.KPI === 'string' ? 
                parseFloat(item.KPI.replace(',', '.')) : 
                Number(item.KPI) : 0;

              // Convertir cédula a número para el ID
              const id = item.CEDULA ? parseInt(item.CEDULA, 10) : Math.floor(Math.random() * 1000000);

              return {
                id: id,
                tipoIESS: item.TIPO_IESS || '',
                mes1: item.MES_1 || '',
                mes2: item.MES_2 || '',
                fechaEntradaSalida: item.FECHA_ENTRADA_SALIDA || '',
                anio: item.ANIO || '',
                cedula: item.CEDULA || '',
                nombre: item.NOMBRE || '',
                sueldo: sueldo,
                kpi: kpi,
                tipoContrato: item.TIPO_DE_CONTRATO || '',
                movilizacionExtrasNoGrab: item.MOVILIZACION_EXTRAS_NOGRAB || '',
                reingreso: item.REINGRESO || '',
                diasArranque: item.DIAS_DE_ARRANQUE || '',
                detalle: item.DETALLE || '',
                cargoActividad: item.CARGO_ACTIVIDAD || '',
                grupoCentrosCostos: item.GRUPO_DE_CENTROS_DE_COSTOS || '',
                centroCostosN1: item.CENTRO_COSTOS_N1 || '',
                centroCostosN2: item.CENTRO_COSTOS_N2 || '',
                registroAvisoEntradaSalidaIESS: item.REGISTRO_DE_AVISO_ENTRADA_SALIDA_IESS || '',
                fechaLegalizacionContrato: item.FECHA_LEGALIZACION_CONTRATO || '',
                fechaTope: item.FECHA_TOPE || '',
                autorizacion1: item.AUTORIZACION_1 || '',
                autorizacion2: item.AUTORIZACION_2 || '',
              } as Headcount; // Forzamos el tipo a Headcount
            });

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

      // Validar que haya datos nuevos
      if (!diffData.newData || diffData.newData.length === 0) {
        throw new Error('No hay datos nuevos para enviar');
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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