"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DiffTable } from "./diff-table";

interface CommitApprovalModalProps {
  commit: any;
  onApprove: () => void;
  onReject: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function CommitApprovalModal({
  commit,
  onApprove,
  onReject,
  onOpenChange,
  open,
}: CommitApprovalModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Revisar cambios para aprobación</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <h4 className="font-medium">Mensaje del commit:</h4>
          <p className="text-sm text-gray-600">{commit.message}</p>
        </div>
        
        <DiffTable 
          oldData={JSON.parse(commit.oldData)} 
          newData={JSON.parse(commit.newData)} 
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="destructive" 
            onClick={() => {
              onReject();
              onOpenChange(false);
            }}
          >
            Rechazar
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              onApprove();
              onOpenChange(false);
            }}
          >
            Aprobar cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}