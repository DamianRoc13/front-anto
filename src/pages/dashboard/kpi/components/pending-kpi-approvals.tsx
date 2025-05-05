"use client";
import { Bell, BellDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription // Añadido
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { useKPI } from '@/hooks/use-kpi';
import { useQueryClient } from "@tanstack/react-query";

interface PendingKpiApprovalsProps {
  onActionCompleted?: () => void;
}

export function PendingKpiApprovals({ onActionCompleted }: PendingKpiApprovalsProps) {
  const queryClient = useQueryClient();
  const { getPendingCommits } = useKPI();
  const { approveKpiCommit } = useKPI();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const auth = useAuth();
  

  const { 
    data: pendingCommits = [], 
    isLoading, 
    error 
  } = getPendingCommits;

  // Debug: Verifica los datos recibidos
  useEffect(() => {
    console.log('Datos de commits pendientes:', pendingCommits);
  }, [pendingCommits]);

  const handleFirstApproval = async (commitId: string) => {
    try {
      await approveKpiCommit.mutateAsync(commitId);
      toast.success("Aprobación realizada con éxito");
    } catch (error) {
      toast.error("Error al aprobar");
      console.error("Error en aprobación:", error);
    }
  };
  if (error) {
    return (
      <div className="text-red-500 text-sm p-2">
        Error al cargar aprobaciones pendientes
      </div>
    );
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={() => setIsDialogOpen(true)}
      >
        {isLoading ? (
          <Bell className="h-5 w-5 opacity-50" />
        ) : (
          <>
            {pendingCommits.length > 0 ? (
              <>
                <BellDot className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {pendingCommits.length}
                </span>
              </>
            ) : (
              <Bell className="h-5 w-5" />
            )}
          </>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>KPIs Pendientes de Aprobación ({pendingCommits.length})</DialogTitle>
            <DialogDescription>
              Lista de calificaciones por cédula
            </DialogDescription>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex justify-center py-4">Cargando...</div>
          ) : error ? (
            <div className="text-red-500 p-4">Error al cargar datos</div>
          ) : pendingCommits.length === 0 ? (
            <div className="text-center py-4">No hay aprobaciones pendientes</div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {pendingCommits.map((commit) => (
                <AccordionItem key={commit.id} value={commit.id}>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{commit.cedula}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(commit.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <AccordionTrigger className="p-2" />
                      <Button 
                        size="sm" 
                        onClick={() => handleFirstApproval(commit.id)}
                        disabled={commit.status !== "pending_first"}
                      >
                        Enviar para aprobación
                      </Button>
                    </div>
                  </div>
                  <AccordionContent className="px-4 pb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Nombre</p>
                        <p className="text-sm">{commit.nombreEmpleado}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Cargo</p>
                        <p className="text-sm">{commit.cargoEmpleado}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Calificación KPI</p>
                        <p className="text-sm">{commit.calificacionKPI}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Observaciones</p>
                        <p className="text-sm">{commit.observaciones}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}