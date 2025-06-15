
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar";
import { Globe, Workflow, Database, Play, Home, User } from "lucide-react";
import { ScrapingInterface } from "@/components/ScrapingInterface";
import { WorkflowBuilder } from "@/components/WorkflowBuilder";
import { DataManager } from "@/components/DataManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [projects] = useState([
    {
      id: 1,
      name: "E-commerce Product Data",
      url: "https://example-store.com",
      status: "active",
      lastRun: "2 hours ago",
      recordCount: 1250
    },
    {
      id: 2,
      name: "News Articles Scraper",
      url: "https://news-site.com",
      status: "paused",
      lastRun: "1 day ago",
      recordCount: 580
    }
  ]);

  const menuItems = [
    {
      id: "home",
      title: "Home",
      icon: Home,
    },
    {
      id: "scraper",
      title: "Web Scraper",
      icon: Globe,
    },
    {
      id: "workflow",
      title: "Workflow Builder",
      icon: Workflow,
    },
    {
      id: "data",
      title: "Data Manager",
      icon: Database,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-blue-700">
                    <Globe className="w-5 h-5 mr-2" />
                    Active Scrapers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-800">12</div>
                  <p className="text-sm text-blue-600">Running workflows</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-purple-700">
                    <Database className="w-5 h-5 mr-2" />
                    Data Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-800">45.2K</div>
                  <p className="text-sm text-purple-600">Total scraped records</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-green-700">
                    <Workflow className="w-5 h-5 mr-2" />
                    Workflows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-800">8</div>
                  <p className="text-sm text-green-600">Automation pipelines</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your latest scraping projects and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{project.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={project.status === "active" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">{project.recordCount.toLocaleString()} records</p>
                          <p className="text-xs text-muted-foreground">Last run: {project.lastRun}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "scraper":
        return <ScrapingInterface />;
      case "workflow":
        return <WorkflowBuilder />;
      case "data":
        return <DataManager />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar>
            <SidebarContent>
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
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
                        className="w-full justify-start"
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>
            </SidebarContent>
          </Sidebar>

          <SidebarInset>
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {menuItems.find(item => item.id === activeTab)?.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === "home" && "Overview of your data engineering activities"}
                      {activeTab === "scraper" && "Configure and run web scrapers"}
                      {activeTab === "workflow" && "Build and manage data processing workflows"}
                      {activeTab === "data" && "Manage and analyze your scraped data"}
                    </p>
                  </div>
                  <Link to="/settings">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </header>

            <main className="container mx-auto px-6 py-8">
              {renderContent()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
