import { ThemeProvider } from "@/components/ui/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/auth/login";
import DashboardLayout from "@/pages/dashboard/layout";
import UsersPage from "@/pages/dashboard/users/page";
import ComprobantesPage from "@/pages/dashboard/comprobantes-sri/page";
import ConsultasAntPage from "@/pages/dashboard/consultas-ant/page"; 
import HEADCOUNTPage from "./pages/dashboard/headcount/page";
import KPIPage from "./pages/dashboard/kpi/page";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="anto-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Rutas anidadas */}
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
  );
}