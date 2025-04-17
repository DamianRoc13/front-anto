"use client";
import { useState } from "react";
import LoginForm from "./login-form";
import ConsultaForm from "./consulta-form";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ComprobantesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLoginSuccess = (data: any) => {
    setUserData(data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="space-y-6">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center">
            <Card className="w-full max-w-2xl"> {/* Ajusta este valor según necesites */}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Comprobantes Electrónicos Recibidos</CardTitle>
                <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm onSuccess={handleLoginSuccess} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Comprobantes Electrónicos Recibidos</h1>
              <Button variant="outline" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </div>
            <ConsultaForm userData={userData} />
          </>
        )}
      </div>
    </div>
  );
}