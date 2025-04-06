"use client";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Users, LogOut } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ThemeProvider 
      attribute="class"
      defaultTheme="dark"
      storageKey="anto-theme"
    >
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar 
            className="text-white border-r"
            collapsible="icon"
          >
            <SidebarHeader className="p-4 border-b">
              <h1 className="text-xl font-bold">ANTO</h1>
            </SidebarHeader>

            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => navigate("/dashboard/users")}
                    data-active={location.pathname.startsWith("/dashboard/users")}
                  >
                    <Users className="size-4" />
                    <span>Usuarios</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>

          <SidebarFooter className="p-4 border-t">
           <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-gray-700 flex items-center justify-center">
             <span className="text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
             </span>
            </div>
           <div className="flex-1 min-w-0">
           <p className="text-sm font-medium truncate">{user?.name}</p>
           <p className="text-xs truncate">{user?.email}</p>
            </div>
            <TooltipProvider>
             <Tooltip>
              <TooltipTrigger asChild>
               <button 
            onClick={logout}
            className="text-gray-400 hover:text-white"
          >
            <LogOut className="size-4" />
          </button>
             </TooltipTrigger>
              <TooltipContent side="top">
                <p>Cerrar sesión</p>
               </TooltipContent>
              </Tooltip>
             </TooltipProvider>
            </div>
           </SidebarFooter>
          </Sidebar>

          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}