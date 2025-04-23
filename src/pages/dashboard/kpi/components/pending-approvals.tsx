"use client";

import { Bell, BellDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";
import { CommitApprovalModal } from "./commit-approval-modal";
import { useAuth } from "@/hooks/use-auth";

interface Commit {
  id: string;
  oldData: string;
  newData: string;
  message: string;
  status: string;
  createdAt: string;
}

export function PendingApprovals() {
  const [pendingCommits, setPendingCommits] = useState<Commit[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
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
      }
    };
    
    fetchPendingCommits();
  }, [auth.user]);

  const handleApprove = async (commitId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.post(`http://localhost:3000/headcount/commits/${commitId}/approve`, {
        approvedBy: auth.user?.name || 'Admin'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setPendingCommits(pendingCommits.filter((c) => c.id !== commitId));
      toast.success("Los cambios han sido aplicados a la tabla");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo aprobar el commit");
    }
  };

  if (pendingCommits.length === 0) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative mb-4">
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
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {pendingCommits.map((commit) => (
            <DropdownMenuItem
              key={commit.id}
              onClick={() => setSelectedCommit(commit)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{commit.message}</span>
                <span className="text-xs text-gray-500">
                  {new Date(commit.createdAt).toLocaleString()}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedCommit && (
        <CommitApprovalModal
          commit={selectedCommit}
          onApprove={() => handleApprove(selectedCommit.id)}
          onOpenChange={(open) => !open && setSelectedCommit(null)}
        />
      )}
    </>
  );
}
