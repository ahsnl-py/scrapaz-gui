import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Workflow, Plus, Play, Settings, ArrowDown, Database, Filter, FileText, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { WorkflowEditor } from "./WorkflowEditor";
import { WorkflowHistory } from "./WorkflowHistory";

export const WorkflowBuilder = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(null);
  const [workflows] = useState([
    {
      id: 1,
      name: "E-commerce Data Pipeline",
      steps: ["Scrape", "Clean", "Transform", "Store"],
      status: "active",
      lastRun: "2024-01-15T10:30:00Z",
      totalRuns: 24,
      successRate: 95.8
    },
    {
      id: 2,
      name: "News Analysis Flow",
      steps: ["Extract", "Analyze", "Categorize", "Export"],
      status: "draft",
      lastRun: "2024-01-14T15:45:00Z",
      totalRuns: 12,
      successRate: 91.7
    },
    {
      id: 3,
      name: "Social Media Monitor",
      steps: ["Monitor", "Filter", "Analyze", "Alert"],
      status: "active",
      lastRun: "2024-01-15T09:15:00Z",
      totalRuns: 156,
      successRate: 98.1
    },
    {
      id: 4,
      name: "Inventory Sync",
      steps: ["Sync", "Validate", "Update", "Notify"],
      status: "paused",
      lastRun: "2024-01-13T22:00:00Z",
      totalRuns: 89,
      successRate: 99.2
    }
  ]);

  const workflowSteps = [
    {
      id: 1,
      type: "scraper",
      title: "Web Scraper",
      description: "Extract data from target website",
      icon: Workflow,
      configured: true
    },
    {
      id: 2,
      type: "filter",
      title: "Data Filter",
      description: "Filter and validate scraped data",
      icon: Filter,
      configured: false
    },
    {
      id: 3,
      type: "transform",
      title: "Data Transform",
      description: "Clean and transform data structure",
      icon: FileText,
      configured: false
    },
    {
      id: 4,
      type: "storage",
      title: "Data Storage",
      description: "Store processed data",
      icon: Database,
      configured: false
    }
  ];

  const handleWorkflowClick = (workflowId: number) => {
    setSelectedWorkflow(workflowId);
  };

  const handleBackToList = () => {
    setSelectedWorkflow(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatLastRun = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  if (selectedWorkflow) {
    const workflow = workflows.find(w => w.id === selectedWorkflow);
    if (!workflow) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToList}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workflows</span>
          </Button>
        </div>
        
        <WorkflowHistory workflowId={selectedWorkflow} workflowName={workflow.name} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workflow List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Workflow className="w-5 h-5 mr-2" />
            Your Workflows
          </CardTitle>
          <CardDescription>Click on any workflow to view its execution history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <div 
                key={workflow.id} 
                className="flex items-center justify-between p-6 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer bg-white hover:bg-gray-50"
                onClick={() => handleWorkflowClick(workflow.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg">{workflow.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(workflow.status)}`}
                    >
                      {workflow.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Last run: {formatLastRun(workflow.lastRun)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Play className="w-4 h-4" />
                      <span>{workflow.totalRuns} total runs</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>{workflow.successRate}% success rate</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {workflow.steps.map((step, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {step}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button size="sm" variant="outline" className="flex items-center space-x-1">
                    <Play className="w-4 h-4" />
                    <span>Run</span>
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
