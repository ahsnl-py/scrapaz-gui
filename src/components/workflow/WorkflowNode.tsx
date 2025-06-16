import { useCallback, useState, useMemo } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  X,
  ExternalLink
} from "lucide-react";
import { WorkflowNodeData } from "./types";
import { WORKFLOW_COMPONENTS } from "./constants";

export const WorkflowNode = ({ data, id }: NodeProps<WorkflowNodeData>) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [componentName, setComponentName] = useState(data.label || "");
  const [configData, setConfigData] = useState({
    apiKey: "",
    endpoint: "",
    parameters: "",
    description: ""
  });
  const [openData, setOpenData] = useState({
    field1: "",
    field2: "",
    dropdown1: "",
    dropdown2: "",
    textarea1: ""
  });
  
  const handleEdit = useCallback(() => {
    setShowEditDialog(true);
  }, []);

  const handleDelete = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleOpen = useCallback(() => {
    setShowOpenDialog(true);
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

  const handleSaveOpen = useCallback(() => {
    // Here you would typically save the open data
    console.log("Saving open data for node:", id, openData);
    setShowOpenDialog(false);
  }, [id, openData]);

  const componentInfo = useMemo(() => {
    for (const group of WORKFLOW_COMPONENTS) {
      const component = group.components.find(comp => comp.type === data.type);
      if (component) return component;
    }
    return null;
  }, [data.type]);

  const Icon = componentInfo?.icon || Settings;
  const isAgentTool = data.type === "agent";

  // Get context-specific options based on component type
  const getContextOptions = useCallback(() => {
    switch (data.type) {
      case "source":
        return {
          title: "Source Component Configuration",
          description: "Configure your data source parameters",
          dropdown1Label: "Source Type",
          dropdown1Options: ["Database", "API", "File", "Stream"],
          dropdown2Label: "Connection Type",
          dropdown2Options: ["Direct", "Pooled", "SSL", "Tunnel"],
          field1Label: "Connection String",
          field2Label: "Authentication Token",
          textareaLabel: "Query or Filter"
        };
      case "transform":
        return {
          title: "Transform Component Configuration",
          description: "Configure data transformation rules",
          dropdown1Label: "Transform Type",
          dropdown1Options: ["Filter", "Map", "Aggregate", "Join", "Sort"],
          dropdown2Label: "Output Format",
          dropdown2Options: ["JSON", "CSV", "XML", "Parquet", "Avro"],
          field1Label: "Transform Rule",
          field2Label: "Output Path",
          textareaLabel: "Custom Logic"
        };
      case "target":
        return {
          title: "Target Component Configuration",
          description: "Configure your data destination",
          dropdown1Label: "Target Type",
          dropdown1Options: ["Database", "File System", "Cloud Storage", "API"],
          dropdown2Label: "Write Mode",
          dropdown2Options: ["Append", "Overwrite", "Merge", "Upsert"],
          field1Label: "Destination Path",
          field2Label: "Batch Size",
          textareaLabel: "Write Configuration"
        };
      case "agent":
        return {
          title: "Agent Tool Configuration",
          description: "Configure AI agent parameters and behavior",
          dropdown1Label: "Agent Type",
          dropdown1Options: ["ChatGPT", "Claude", "Gemini", "Custom"],
          dropdown2Label: "Model Version",
          dropdown2Options: ["GPT-4", "GPT-3.5", "Claude-3", "Gemini-Pro"],
          field1Label: "API Endpoint",
          field2Label: "Temperature",
          textareaLabel: "System Prompt"
        };
      default:
        return {
          title: "Component Configuration",
          description: "Configure component parameters",
          dropdown1Label: "Option 1",
          dropdown1Options: ["Option A", "Option B", "Option C"],
          dropdown2Label: "Option 2",
          dropdown2Options: ["Choice 1", "Choice 2", "Choice 3"],
          field1Label: "Field 1",
          field2Label: "Field 2",
          textareaLabel: "Additional Configuration"
        };
    }
  }, [data.type]);

  const contextOptions = getContextOptions();

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
                  <DropdownMenuItem onClick={handleOpen}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open
                  </DropdownMenuItem>
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

      {/* Open Dialog - Generic Component Configuration */}
      <Dialog open={showOpenDialog} onOpenChange={setShowOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{contextOptions.title}</DialogTitle>
            <DialogDescription>
              {contextOptions.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dropdown1">{contextOptions.dropdown1Label}</Label>
                <Select value={openData.dropdown1} onValueChange={(value) => setOpenData(prev => ({ ...prev, dropdown1: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${contextOptions.dropdown1Label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {contextOptions.dropdown1Options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dropdown2">{contextOptions.dropdown2Label}</Label>
                <Select value={openData.dropdown2} onValueChange={(value) => setOpenData(prev => ({ ...prev, dropdown2: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${contextOptions.dropdown2Label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {contextOptions.dropdown2Options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="field1">{contextOptions.field1Label}</Label>
              <Input
                id="field1"
                value={openData.field1}
                onChange={(e) => setOpenData(prev => ({ ...prev, field1: e.target.value }))}
                placeholder={`Enter ${contextOptions.field1Label.toLowerCase()}`}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="field2">{contextOptions.field2Label}</Label>
              <Input
                id="field2"
                value={openData.field2}
                onChange={(e) => setOpenData(prev => ({ ...prev, field2: e.target.value }))}
                placeholder={`Enter ${contextOptions.field2Label.toLowerCase()}`}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="textarea1">{contextOptions.textareaLabel}</Label>
              <Textarea
                id="textarea1"
                value={openData.textarea1}
                onChange={(e) => setOpenData(prev => ({ ...prev, textarea1: e.target.value }))}
                placeholder={`Enter ${contextOptions.textareaLabel.toLowerCase()}`}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOpenDialog(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSaveOpen}>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}; 