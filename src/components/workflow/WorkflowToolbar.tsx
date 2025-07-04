import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Play } from "lucide-react";

interface WorkflowToolbarProps {
  onRun: () => void;
  onSave: () => void;
  isRunning: boolean;
  nodeCount: number;
  workflowName?: string;
  onWorkflowNameChange?: (name: string) => void;
}

export const WorkflowToolbar = ({ 
  onRun, 
  onSave, 
  isRunning, 
  nodeCount,
  workflowName = "New Workflow",
  onWorkflowNameChange
}: WorkflowToolbarProps) => {
  return (
    <div className="h-12 bg-background border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold">Workflow Editor</h1>
        {onWorkflowNameChange ? (
          <Input
            value={workflowName}
            onChange={(e) => onWorkflowNameChange(e.target.value)}
            className="w-64"
            placeholder="Enter workflow name"
          />
        ) : (
          <span className="text-sm text-muted-foreground">
            {workflowName}
          </span>
        )}
        <span className="text-sm text-muted-foreground">
          {nodeCount} component{nodeCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSave}
          disabled={nodeCount === 0}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Workflow
        </Button>
        <Button 
          size="sm" 
          onClick={onRun}
          disabled={isRunning || nodeCount === 0}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? "Running..." : "Run Workflow"}
        </Button>
      </div>
    </div>
  );
}; 