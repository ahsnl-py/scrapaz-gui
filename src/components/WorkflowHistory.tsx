import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Play, 
  Download, 
  Eye,
  Calendar,
  Timer,
  Database,
  FileText,
  Filter,
  Globe
} from "lucide-react";

interface WorkflowHistoryProps {
  workflowId: number;
  workflowName: string;
}

interface ExecutionRecord {
  id: string;
  timestamp: string;
  status: "success" | "failed" | "running" | "pending";
  duration: number;
  recordsProcessed: number;
  errors: string[];
  steps: {
    name: string;
    status: "success" | "failed" | "running" | "pending";
    duration: number;
    recordsProcessed: number;
    icon: any;
  }[];
}

export const WorkflowHistory = ({ workflowId, workflowName }: WorkflowHistoryProps) => {
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);
  
  // Mock execution history data
  const executionHistory: ExecutionRecord[] = [
    {
      id: "exec_001",
      timestamp: "2024-01-15T10:30:00Z",
      status: "success",
      duration: 245,
      recordsProcessed: 1250,
      errors: [],
      steps: [
        {
          name: "Web Scraper",
          status: "success",
          duration: 45,
          recordsProcessed: 1250,
          icon: Globe
        },
        {
          name: "Data Filter",
          status: "success",
          duration: 12,
          recordsProcessed: 1180,
          icon: Filter
        },
        {
          name: "Data Transform",
          status: "success",
          duration: 23,
          recordsProcessed: 1180,
          icon: FileText
        },
        {
          name: "Data Storage",
          status: "success",
          duration: 15,
          recordsProcessed: 1180,
          icon: Database
        }
      ]
    },
    {
      id: "exec_002",
      timestamp: "2024-01-15T08:15:00Z",
      status: "failed",
      duration: 89,
      recordsProcessed: 0,
      errors: ["Connection timeout", "Invalid API response"],
      steps: [
        {
          name: "Web Scraper",
          status: "failed",
          duration: 89,
          recordsProcessed: 0,
          icon: Globe
        },
        {
          name: "Data Filter",
          status: "pending",
          duration: 0,
          recordsProcessed: 0,
          icon: Filter
        },
        {
          name: "Data Transform",
          status: "pending",
          duration: 0,
          recordsProcessed: 0,
          icon: FileText
        },
        {
          name: "Data Storage",
          status: "pending",
          duration: 0,
          recordsProcessed: 0,
          icon: Database
        }
      ]
    },
    {
      id: "exec_003",
      timestamp: "2024-01-15T06:00:00Z",
      status: "success",
      duration: 198,
      recordsProcessed: 980,
      errors: [],
      steps: [
        {
          name: "Web Scraper",
          status: "success",
          duration: 38,
          recordsProcessed: 980,
          icon: Globe
        },
        {
          name: "Data Filter",
          status: "success",
          duration: 8,
          recordsProcessed: 920,
          icon: Filter
        },
        {
          name: "Data Transform",
          status: "success",
          duration: 18,
          recordsProcessed: 920,
          icon: FileText
        },
        {
          name: "Data Storage",
          status: "success",
          duration: 12,
          recordsProcessed: 920,
          icon: Database
        }
      ]
    },
    {
      id: "exec_004",
      timestamp: "2024-01-14T22:00:00Z",
      status: "success",
      duration: 267,
      recordsProcessed: 2100,
      errors: [],
      steps: [
        {
          name: "Web Scraper",
          status: "success",
          duration: 52,
          recordsProcessed: 2100,
          icon: Globe
        },
        {
          name: "Data Filter",
          status: "success",
          duration: 15,
          recordsProcessed: 1980,
          icon: Filter
        },
        {
          name: "Data Transform",
          status: "success",
          duration: 28,
          recordsProcessed: 1980,
          icon: FileText
        },
        {
          name: "Data Storage",
          status: "success",
          duration: 18,
          recordsProcessed: 1980,
          icon: Database
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "running":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case "pending":
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "running":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const selectedExecutionData = executionHistory.find(exec => exec.id === selectedExecution);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{workflowName}</h1>
          <p className="text-muted-foreground">Execution History</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export History
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Play className="w-4 h-4 mr-2" />
            Run Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Execution List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Recent Executions
              </CardTitle>
              <CardDescription>Click on an execution to view detailed information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {executionHistory.map((execution) => (
                  <div
                    key={execution.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedExecution === execution.id
                        ? "border-blue-500 bg-blue-50"
                        : "hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedExecution(execution.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(execution.status)}
                        <span className="font-medium">Execution #{execution.id.split('_')[1]}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(execution.status)}`}
                      >
                        {execution.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Timer className="w-4 h-4" />
                        <span>{formatDuration(execution.duration)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Database className="w-4 h-4" />
                        <span>{execution.recordsProcessed.toLocaleString()} records</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatTimestamp(execution.timestamp)}</span>
                      </div>
                    </div>
                    
                    {execution.errors.length > 0 && (
                      <div className="mt-2 text-sm text-red-600">
                        {execution.errors.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Execution Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Execution Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedExecutionData ? (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      #{selectedExecutionData.id.split('_')[1]}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatTimestamp(selectedExecutionData.timestamp)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(selectedExecutionData.status)}`}
                      >
                        {selectedExecutionData.status}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Duration:</span>
                      <span className="text-sm">{formatDuration(selectedExecutionData.duration)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Records Processed:</span>
                      <span className="text-sm">{selectedExecutionData.recordsProcessed.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Step Details</h4>
                    <div className="space-y-2">
                      {selectedExecutionData.steps.map((step, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <step.icon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{step.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusColor(step.status)}`}
                            >
                              {step.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDuration(step.duration)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedExecutionData.errors.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2 text-red-600">Errors</h4>
                      <div className="space-y-1">
                        {selectedExecutionData.errors.map((error, index) => (
                          <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Select an execution to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
