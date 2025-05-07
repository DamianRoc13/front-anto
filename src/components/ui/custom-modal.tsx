import { ReactNode } from "react";
import { X } from "lucide-react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export const CustomModal = ({ isOpen, onClose, title, description, children }: CustomModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-neutral-900 text-neutral-100 rounded-lg shadow-lg w-[90%] max-w-[1200px] p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            {description && <p className="text-sm text-neutral-400">{description}</p>}
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
