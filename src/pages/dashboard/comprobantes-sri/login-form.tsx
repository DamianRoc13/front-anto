"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginForm({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [formData, setFormData] = useState({
    usuario: "",
    ciAdicional: "",
    clave: "",
  });
  const [loading, setLoading] = useState(false);
  const [ciError, setCiError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      onSuccess(data);
      toast.success("Sesión iniciada correctamente");
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleCiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, ciAdicional: value });
    setCiError(value.length > 0 && (value.length !== 10 || !/^\d+$/.test(value)));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="usuario">RUC / C.I. / Pasaporte:</Label>
        <Input
          id="usuario"
          value={formData.usuario}
          onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ciAdicional">C.I. Adicional:</Label>
        <Input
          id="ciAdicional"
          value={formData.ciAdicional}
          onChange={handleCiChange}
          maxLength={10}
        />
        {ciError && (
          <p className="text-sm text-red-500">Debe tener exactamente 10 dígitos</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="clave">Clave:</Label>
        <Input
          id="clave"
          type="password"
          value={formData.clave}
          onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Iniciando sesión..." : "Ingresar"}
      </Button>
    </form>
  );
}