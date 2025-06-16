import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  ReactFlowProvider,
  Connection,
  Node,
  NodeProps,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
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
  Database, 
  FileText, 
  Globe, 
  Settings, 
  Filter, 
  ArrowRight, 
  Bot, 
  Cloud, 
  MoreHorizontal,
  Edit,
  Trash2
} from "lucide-react";

// Component definitions for the sidebar
const componentGroups = {
  "ETL Basic Tools": [
    {
      id: "source",
      name: "Source Component",
      description: "Data input component",
      icon: Database,
      color: "bg-blue-500",
      type: "source"
    },
    {
      id: "transform",
      name: "Transformation Component", 
      description: "Data processing component",
      icon: Filter,
      color: "bg-yellow-500",
      type: "transform"
    },
    {
      id: "target",
      name: "Target Component",
      description: "Data output component", 
      icon: FileText,
      color: "bg-green-500",
      type: "target"
    }
  ],
  "Agent Tools": [
    {
      id: "new-agent",
      name: "New Agent Tool",
      description: "Create new AI agent",
      icon: Bot,
      color: "bg-purple-500",
      type: "agent"
    },
    {
      id: "weather-agent",
      name: "Weather Agent Tool",
      description: "Weather data agent",
      icon: Cloud,
      color: "bg-cyan-500", 
      type: "agent"
    },
    {
      id: "web-agent",
      name: "Web Agent Tool",
      description: "Web scraping agent",
      icon: Globe,
      color: "bg-orange-500",
      type: "agent"
    }
  ]
};

// Custom node component with options button and connection handles
const CustomNode = ({ data, id }: NodeProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log("Edit node:", id);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    // This will be handled by the parent component
    if (data.onDelete) {
      data.onDelete(id);
    }
    setShowDeleteDialog(false);
  };

  const getComponentInfo = (type: string) => {
    for (const group of Object.values(componentGroups)) {
      const component = group.find(comp => comp.type === type);
      if (component) return component;
    }
    return null;
  };

  const componentInfo = getComponentInfo(data.type);
  const Icon = componentInfo?.icon || Settings;

  return (
    <>
      <Card className="min-w-[180px] border-2 border-gray-300 relative group">
        {/* Source handle (left side) - for output connections */}
        <Handle
          type="source"
          position={Position.Left}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
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
                <p className="text-xs text-muted-foreground">{componentInfo?.description}</p>
              </div>
            </div>
            
            {/* Options button - only visible on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
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
          className="w-3 h-3 bg-green-500 border-2 border-white"
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

const nodeTypes = {
  custom: CustomNode,
};

export function SimpleNodeEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current) return;
      
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const componentData = event.dataTransfer.getData("application/reactflow");
      
      if (!componentData) return;
      
      const { type, label, description } = JSON.parse(componentData);
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      
      const newNode: Node = {
        id: `node_${Date.now()}`,
        type: "custom",
        position,
        data: {
          type,
          label,
          description,
          onDelete: handleDeleteNode, // Pass delete function to node
        },
      };
      
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    // Also remove any connected edges
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const onDragStart = (event: React.DragEvent, component: any) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(component));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="h-screen flex">
      {/* Enhanced Sidebar */}
      <div className="w-64 bg-background border-r border-border overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Components</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Drag components to the canvas
          </p>
          
          {Object.entries(componentGroups).map(([groupName, components]) => (
            <div key={groupName} className="mb-6">
              <h3 className="text-sm font-medium text-foreground mb-3 border-b pb-2">
                {groupName}
              </h3>
              <div className="space-y-2">
                {components.map((component) => {
                  const Icon = component.icon;
                  return (
                    <Card
                      key={component.id}
                      className="cursor-grab hover:shadow-md transition-shadow border-dashed border-2 border-border hover:border-primary/50"
                      draggable
                      onDragStart={(e) => onDragStart(e, component)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${component.color} text-white`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {component.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {component.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
