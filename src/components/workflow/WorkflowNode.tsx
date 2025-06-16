import { useCallback, useState, useMemo } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Settings, 
  MoreHorizontal,
  Edit,
  Trash2,
  Save,
  X
} from "lucide-react";
import { WorkflowNodeData } from "./types";
import { WORKFLOW_COMPONENTS } from "./constants";

export const WorkflowNode = ({ data, id }: NodeProps<WorkflowNodeData>) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [componentName, setComponentName] = useState(data.label || "");
  const [configData, setConfigData] = useState({
    apiKey: "",
    endpoint: "",
    parameters: "",
    description: ""
  });
  
  const handleEdit = useCallback(() => {
    setShowEditDialog(true);
  }, []);

  const handleDelete = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(() => {
    data.onDelete(id);
    setShowDeleteDialog(false);
  }, [data.onDelete, id]);

  const handleSaveEdit = useCallback(() => {
    // Update the node data with new name
    data.onEdit?.(id, componentName);
    setShowEditDialog(false);
  }, [data.onEdit, id, componentName]);

  const handleConfigure = useCallback(() => {
    setShowConfigDialog(true);
  }, []);

  const handleSaveConfig = useCallback(() => {
    // Here you would typically save the configuration
    console.log("Saving configuration for node:", id, configData);
    setShowConfigDialog(false);
  }, [id, configData]);

  const componentInfo = useMemo(() => {
    for (const group of WORKFLOW_COMPONENTS) {
      const component = group.components.find(comp => comp.type === data.type);
      if (component) return component;
    }
    return null;
  }, [data.type]);

  const Icon = componentInfo?.icon || Settings;
  const isAgentTool = data.type === "agent";

  return (
    <>
      <Card className="min-w-[120px] border-2 border-gray-300 relative group">
        {/* Source handle (left side) - for output connections */}
        <Handle
          type="source"
          position={Position.Left}
          className="w-3 h-3 bg-blue-500 border-2 border-white hover:bg-blue-600 transition-colors"
          style={{ left: -6 }}
        />
        
        <CardContent className="p-3">
          <div className="flex flex-col items-center space-y-2">
            {/* Icon and Name in vertical layout */}
            <div className={`p-2 rounded-lg ${componentInfo?.color || 'bg-gray-500'} text-white`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-xs">{componentName || componentInfo?.name}</h3>
            </div>
            
            {/* Options button - only visible on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    aria-label="Node options"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  {isAgentTool && (
                    <DropdownMenuItem onClick={handleConfigure}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>

        {/* Target handle (right side) - for input connections */}
        <Handle
          type="target"
          position={Position.Right}
          className="w-3 h-3 bg-green-500 border-2 border-white hover:bg-green-600 transition-colors"
          style={{ right: -6 }}
        />
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Component</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this component? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Rename dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Component</DialogTitle>
            <DialogDescription>
              Enter a new name for this component.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="component-name">Component Name</Label>
              <Input
                id="component-name"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                placeholder="Enter component name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Agent Tool Configuration Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Agent Tool</DialogTitle>
            <DialogDescription>
              Configure the parameters for this agent tool. Fill in the required information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={configData.apiKey}
                onChange={(e) => setConfigData(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Enter your API key"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input
                id="endpoint"
                value={configData.endpoint}
                onChange={(e) => setConfigData(prev => ({ ...prev, endpoint: e.target.value }))}
                placeholder="https://api.example.com/v1/agent"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parameters">Parameters (JSON)</Label>
              <Textarea
                id="parameters"
                value={configData.parameters}
                onChange={(e) => setConfigData(prev => ({ ...prev, parameters: e.target.value }))}
                placeholder='{"temperature": 0.7, "max_tokens": 1000}'
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={configData.description}
                onChange={(e) => setConfigData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this agent tool does..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSaveConfig}>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}; 