
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Workflow, Plus, Play, Settings, ArrowDown, Database, Filter, FileText } from "lucide-react";

export const WorkflowBuilder = () => {
  const [workflows] = useState([
    {
      id: 1,
      name: "E-commerce Data Pipeline",
      steps: ["Scrape", "Clean", "Transform", "Store"],
      status: "active"
    },
    {
      id: 2,
      name: "News Analysis Flow",
      steps: ["Extract", "Analyze", "Categorize", "Export"],
      status: "draft"
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

  return (
    <div className="space-y-6">
      {/* Workflow List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Workflow className="w-5 h-5 mr-2" />
            Your Workflows
          </CardTitle>
          <CardDescription>Manage your data processing workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div>
                  <h3 className="font-semibold">{workflow.name}</h3>
                  <div className="flex space-x-2 mt-2">
                    {workflow.steps.map((step, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {step}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                    {workflow.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Build New Workflow</CardTitle>
          <CardDescription>Drag and drop components to create your data pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflowSteps.map((step, index) => (
              <div key={step.id}>
                <Card className={`border-2 border-dashed ${step.configured ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          step.configured ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <step.icon className={`w-5 h-5 ${step.configured ? 'text-green-600' : 'text-gray-600'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                      <Button size="sm" variant={step.configured ? "default" : "outline"}>
                        <Settings className="w-4 h-4 mr-2" />
                        {step.configured ? "Edit" : "Configure"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {index < workflowSteps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowDown className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
            
            <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
