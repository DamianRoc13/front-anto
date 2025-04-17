"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ConsultaForm from "./consulta-form";
import ImportModal from "./import-modal";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function ConsultasAntPage() {
  const handleDownload = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/descargar-excel");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "DB-CONSULTA.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const error = await response.json();
        toast.error(error.error);
      }
    } catch (error) {
      toast.error("Error al descargar el archivo");
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex justify-between items-center">
            <span>Consultas ANT</span>
            <div className="flex gap-2">
              <ImportModal />
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleDownload} 
              >
                <Download className="size-4" />
                Descargar Plantilla
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConsultaForm />
        </CardContent>
      </Card>
    </div>
  );
}