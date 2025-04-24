"use client";

import { Bell, BellDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";
import { CommitApprovalModal } from "./commit-approval-modal";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PendingApprovalsProps {
  onActionCompleted?: () => void;
}

export function PendingApprovals({ onActionCompleted }: PendingApprovalsProps) {
  const [pendingCommits, setPendingCommits] = useState<any[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<any | null>(null);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    const fetchPendingCommits = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:3000/headcount/commits/pending', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPendingCommits(response.data);
      } catch (error) {
        console.error("Error fetching pending commits:", error);
        toast.error("Error al cargar aprobaciones pendientes");
      }
    };
    
    fetchPendingCommits();
  }, [auth.user]);

  const handleApprove = async (commitId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.post(`http://localhost:3000/headcount/commits/${commitId}/approve`, {
        approvedBy: auth.user?.name || 'Admin'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setPendingCommits(pendingCommits.filter((c) => c.id !== commitId));
      onActionCompleted?.(); 
      toast.success("Cambios aprobados y tabla actualizada");
    } catch (error) {
      toast.error("Error al aprobar los cambios");
    }
  };

  const handleReject = async (commitId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.post(`http://localhost:3000/headcount/commits/${commitId}/reject`, {
        rejectedBy: auth.user?.name || 'Admin'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setPendingCommits(pendingCommits.filter((c) => c.id !== commitId));
      onActionCompleted?.(); 
      toast.success("Cambios rechazados");
    } catch (error) {
      toast.error("Error al rechazar los cambios");
    }
  };

  if (pendingCommits.length === 0) return null;

  return (
    <>
      {/* Botón de campanita */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={() => setIsListOpen(true)}
      >
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
      </Button>

      {/* Modal de lista de pendientes */}
      <Dialog open={isListOpen} onOpenChange={setIsListOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aprobaciones Pendientes ({pendingCommits.length})</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2">
            {pendingCommits.map((commit) => (
              <div 
                key={commit.id} 
                className="p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedCommit(commit);
                  setIsApprovalOpen(true);
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{commit.message}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(commit.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver cambios
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de aprobación/rechazo */}
      {selectedCommit && (
        <CommitApprovalModal
          commit={selectedCommit}
          onApprove={() => {
            handleApprove(selectedCommit.id);
            setIsListOpen(false);
            setIsApprovalOpen(false);
          }}
          onReject={() => {
            handleReject(selectedCommit.id);
            setIsListOpen(false);
            setIsApprovalOpen(false);
          }}
          onOpenChange={(open) => {
            if (!open) {
              setIsApprovalOpen(false);
              setSelectedCommit(null);
            } else {
              setIsApprovalOpen(true);
            }
          }}
          open={isApprovalOpen}
        />
      )}
    </>
  );
}