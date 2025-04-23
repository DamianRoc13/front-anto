import { DataTable } from "@/components/ui/data-table";
import { columns } from "./components/columns";
import { DownloadTemplateButton } from "./components/download-template-button";
import { ImportCSVButton } from "./components/import-csv-button";
import { PendingApprovals } from "./components/pending-approvals";
import { useAuth } from "@/hooks/use-auth";
import { useHeadcount } from "@/hooks/use-headcount";

export default function KPIPage() {
  const { user } = useAuth();
  const { data, loading, error } = useHeadcount();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">KPI</h1>
        <div className="flex gap-2">
          <DownloadTemplateButton />
          <ImportCSVButton />
        </div>
      </div>

      {user?.role === 'admin' && <PendingApprovals />}
      
      <DataTable columns={columns} data={data} />
    </div>
  );
}