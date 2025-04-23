// src/pages/dashboard/kpi/components/row-info-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Headcount } from "@/types/headcount";

interface RowInfoModalProps {
  data: Headcount;
  children: React.ReactNode;
}

export function RowInfoModal({ data, children }: RowInfoModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Información detallada</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <h4 className="text-sm font-medium text-gray-500">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h4>
              <p className="text-sm">{value || "-"}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}