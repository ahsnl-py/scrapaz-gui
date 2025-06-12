
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Workflow, Database, Plus, Play, Settings } from "lucide-react";
import { ScrapingInterface } from "@/components/ScrapingInterface";
import { WorkflowBuilder } from "@/components/WorkflowBuilder";
import { DataManager } from "@/components/DataManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("scraper");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Srap-AZ
                </h1>
                <p className="text-sm text-muted-foreground">Data Engineering Toolkit</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        <Card className="mb-8 border-0 shadow-lg">
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

        {/* Main Interface */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Data Engineering Toolkit</CardTitle>
            <CardDescription>Configure scrapers, build workflows, and manage your data</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="scraper" className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Web Scraper</span>
                </TabsTrigger>
                <TabsTrigger value="workflow" className="flex items-center space-x-2">
                  <Workflow className="w-4 h-4" />
                  <span>Workflow Builder</span>
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>Data Manager</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="scraper" className="mt-6">
                <ScrapingInterface />
              </TabsContent>

              <TabsContent value="workflow" className="mt-6">
                <WorkflowBuilder />
              </TabsContent>

              <TabsContent value="data" className="mt-6">
                <DataManager />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
