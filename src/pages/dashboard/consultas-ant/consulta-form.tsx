"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ConsultaForm() {
  const [tipoConsulta, setTipoConsulta] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tipoConsulta) {
      toast.warning("Selecciona un tipo de consulta");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5001/realizar-consulta?tipoConsulta=${tipoConsulta}`);
      const data = await response.json();

      if (data.success) {
        toast.success("Consulta realizada correctamente", {
          description: `Archivo guardado en: ${data.rutaArchivo}`
        });
      } else {
        toast.error("Error en la consulta", {
          description: data.error
        });
      }
    } catch (error) {
      toast.error("Error de conexión", {
        description: "No se pudo conectar al servidor"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Tipo de Consulta</Label>
        <Select value={tipoConsulta} onValueChange={setTipoConsulta}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PLACA">Placas</SelectItem>
            <SelectItem value="RUC">RUC</SelectItem>
            <SelectItem value="CEDULA-EX">Cédula Externa</SelectItem>
            <SelectItem value="CEDULA-IN">Cédula Interna</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Consultando..." : "Realizar Consulta"}
        </Button>
        <Button 
          variant="secondary" 
          onClick={async () => {
            setLoading(true);
            try {
              const response = await fetch(`http://127.0.0.1:5001/realizar-consulta?tipoConsulta=UNIFICAR-EXCEL`);
              const data = await response.json();
              // ... manejo de respuesta ...
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          Unificar Consultas
        </Button>
      </div>
    </div>
  );
}