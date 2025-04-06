import { ThemeProvider } from "@/components/ui/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/auth/login";
import DashboardLayout from "@/pages/dashboard/layout";
import UsersPage from "@/pages/dashboard/users/page";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="anto-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="users" element={<UsersPage />} />
            <Route path="users/new" element={<div>Nuevo Usuario</div>} />
            <Route path="users/:id" element={<div>Editar Usuario</div>} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}