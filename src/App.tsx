import { ThemeProvider } from "@/components/ui/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from "@/pages/auth/login";
import DashboardLayout from "@/pages/dashboard/layout";
import UsersPage from "@/pages/dashboard/users/page";
import ComprobantesPage from "@/pages/dashboard/comprobantes-sri/page";
import ConsultasAntPage from "@/pages/dashboard/consultas-ant/page"; 
import HEADCOUNTPage from "./pages/dashboard/headcount/page";
import KPIPage from "./pages/dashboard/kpi/page";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="anto-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<UsersPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="comprobantes-sri" element={<ComprobantesPage />} />
              <Route path="consultas-ant" element={<ConsultasAntPage />} />
              <Route path="headcount" element={<HEADCOUNTPage />} />
              <Route path="kpi" element={<KPIPage />} />
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-center" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}