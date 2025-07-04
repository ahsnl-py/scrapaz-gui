import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "./UserNav";
import { Globe } from "lucide-react";

type MenuItem = {
  id: string;
  title: string;
  icon: React.ElementType;
};

interface AppLayoutProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

export const AppLayout = ({ children, menuItems, activeTab, setActiveTab, handleLogout }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SidebarProvider>
        <div
          style={{
            "--sidebar-width-icon": "4.5rem",
          } as React.CSSProperties}
          className="min-h-screen flex w-full"
        >
          <Sidebar collapsible="icon">
            <SidebarContent>
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-6 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:space-x-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div className="group-data-[collapsible=icon]:hidden">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Srap-AZ
                    </h1>
                    <p className="text-xs text-muted-foreground">Data Engineering Toolkit</p>
                  </div>
                </div>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        onClick={() => setActiveTab(item.id)}
                        isActive={activeTab === item.id}
                        className="w-full flex justify-start group-data-[collapsible=icon]:justify-center"
                        tooltip={item.title}
                      >
                        <item.icon className="w-6 h-6 group-data-[collapsible=icon]:mx-auto" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>
            </SidebarContent>
          </Sidebar>

          <SidebarInset>
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
              <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="relative z-10" />
                </div>
                <div className="flex items-center space-x-4">
                  <UserNav handleLogout={handleLogout} />
                </div>
              </div>
            </header>

            <main className="container mx-auto px-6 py-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};
