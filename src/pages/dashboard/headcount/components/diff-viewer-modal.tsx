"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { DiffTable } from "./diff-table";

interface DiffViewerModalProps {
  oldData: any[];
  newData: any[];
  onCommit: (message: string) => void;
  onOpenChange: (open: boolean) => void;
}

export function DiffViewerModal({
  oldData,
  newData,
  onCommit,
  onOpenChange,
}: DiffViewerModalProps) {
  const [commitMessage, setCommitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onCommit(commitMessage);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={true} 
      onOpenChange={(open) => {
        if (!open) {
          // Resetear el estado al cerrar
          setCommitMessage("");
          setIsSubmitting(false);
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comparación de cambios</DialogTitle>
        </DialogHeader>
        
        <DiffTable oldData={oldData} newData={newData} />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Observación (obligatoria)
          </label>
          <Textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Describe los cambios realizados..."
            required
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCommit}
            disabled={!commitMessage.trim() || isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar para aprobación"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}