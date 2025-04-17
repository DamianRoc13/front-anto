"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function ConsultaForm({ userData }: { userData: any }) {
  const [formData, setFormData] = useState({
    anio: "",
    mes: "",
    dia: "",
    tipoComprobante: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        anio: userData.anos?.[0] || "",
        mes: userData.meses?.[0]?.value || "",
        dia: userData.dias?.[0] || "",
        tipoComprobante: userData.tipos_comprobante?.[0]?.value || "",
      });
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/consultar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: "",
          ciAdicional: "",
          clave: "",
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Consulta realizada correctamente. Los archivos se han guardado en tu escritorio.");
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Año:</Label>
          <Select
            value={formData.anio}
            onValueChange={(value) => setFormData({ ...formData, anio: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione año" />
            </SelectTrigger>
            <SelectContent>
              {userData?.anos?.map((ano: string) => (
                <SelectItem key={ano} value={ano}>
                  {ano}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Mes:</Label>
          <Select
            value={formData.mes}
            onValueChange={(value) => setFormData({ ...formData, mes: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione mes" />
            </SelectTrigger>
            <SelectContent>
              {userData?.meses?.map((mes: { value: string; name: string }) => (
                <SelectItem key={mes.value} value={mes.value}>
                  {mes.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Día:</Label>
          <Select
            value={formData.dia}
            onValueChange={(value) => setFormData({ ...formData, dia: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione día" />
            </SelectTrigger>
            <SelectContent>
              {userData?.dias?.map((dia: string) => (
                <SelectItem key={dia} value={dia}>
                  {dia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tipo de Comprobante:</Label>
        <Select
          value={formData.tipoComprobante}
          onValueChange={(value) => setFormData({ ...formData, tipoComprobante: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione tipo" />
          </SelectTrigger>
          <SelectContent>
            {userData?.tipos_comprobante?.map((tipo: { value: string; name: string }) => (
              <SelectItem key={tipo.value} value={tipo.value}>
                {tipo.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="pt-2">
        <p className="text-sm text-muted-foreground mb-4">
          En tu escritorio se creará la carpeta "control-sri" con los resultados.
        </p>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Consultando..." : "Consultar"}
        </Button>
      </div>
    </form>
  );
}