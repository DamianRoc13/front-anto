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
import { PanelLeft, Users, LogOut } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes"; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

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
                  <SidebarMenuButton>
                    <Users className="size-4" />
                    <span>Usuarios</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t ">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs truncate">{user?.email}</p>
                </div>
                <button 
                  onClick={logout}
                  className="text-gray-400 hover:text-white"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 overflow-auto p-6">
            {children}
            <Toaster position="top-right" />
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}