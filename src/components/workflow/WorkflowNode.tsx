import { useCallback, useState, useMemo } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Trash2
} from "lucide-react";
import { WorkflowNodeData } from "./types";
import { WORKFLOW_COMPONENTS } from "./constants";

export const WorkflowNode = ({ data, id }: NodeProps<WorkflowNodeData>) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleEdit = useCallback(() => {
    data.onEdit?.(id);
  }, [data.onEdit, id]);

  const handleDelete = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(() => {
    data.onDelete(id);
    setShowDeleteDialog(false);
  }, [data.onDelete, id]);

  const componentInfo = useMemo(() => {
    for (const group of WORKFLOW_COMPONENTS) {
      const component = group.components.find(comp => comp.type === data.type);
      if (component) return component;
    }
    return null;
  }, [data.type]);

  const Icon = componentInfo?.icon || Settings;

  return (
    <>
      <Card className="min-w-[180px] border-2 border-gray-300 relative group">
        {/* Source handle (left side) - for output connections */}
        <Handle
          type="source"
          position={Position.Left}
          className="w-3 h-3 bg-blue-500 border-2 border-white hover:bg-blue-600 transition-colors"
          style={{ left: -6 }}
        />
        
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${componentInfo?.color || 'bg-gray-500'} text-white`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-sm">{data.label || componentInfo?.name}</h3>
                <p className="text-xs text-muted-foreground">{data.description || componentInfo?.description}</p>
              </div>
            </div>
            
            {/* Options button - only visible on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
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
                    Edit
                  </DropdownMenuItem>
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
    </>
  );
}; 