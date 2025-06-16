import { useCallback, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactFlow, {
  Controls,
  Background,
  ReactFlowProvider,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { useWorkflowState } from "../components/workflow/useWorkflowState";
import { ComponentSidebar } from "../components/workflow/ComponentSidebar";
import { WorkflowToolbar } from "../components/workflow/WorkflowToolbar";
import { nodeTypes } from "../components/workflow/nodeTypes";
import { WorkflowComponent } from "../components/workflow/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function WorkflowEditorPage() {
  const navigate = useNavigate();
  const { workflowId } = useParams();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [workflowName, setWorkflowName] = useState(
    workflowId ? `Workflow ${workflowId}` : "New Workflow"
  );
  
  const {
    nodes,
    edges,
    isRunning,
    onNodesChange,
    onEdgesChange,
    addNode,
    connectNodes,
    runWorkflow,
    saveWorkflow,
  } = useWorkflowState();

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
      
      const component: WorkflowComponent = JSON.parse(componentData);
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      
      addNode(component, position);
    },
    [addNode]
  );

  const onDragStart = useCallback((event: React.DragEvent, component: WorkflowComponent) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(component));
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const handleSave = useCallback(() => {
    const workflowData = {
      id: workflowId || `workflow_${Date.now()}`,
      name: workflowName,
      nodes,
      edges,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: "1.0.0"
      }
    };
    
    // Save to localStorage for now (in real app, this would go to backend)
    const existingWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    const workflowIndex = existingWorkflows.findIndex((w: any) => w.id === workflowData.id);
    
    if (workflowIndex >= 0) {
      existingWorkflows[workflowIndex] = workflowData;
    } else {
      existingWorkflows.push(workflowData);
    }
    
    localStorage.setItem('workflows', JSON.stringify(existingWorkflows));
    
    // Trigger the original save function for any additional logic
    saveWorkflow();
  }, [workflowId, workflowName, nodes, edges, saveWorkflow]);

  const handleBack = useCallback(() => {
    navigate('/workflows');
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header with back button and workflow name */}
      <div className="h-12 bg-background border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workflows</span>
          </Button>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-lg font-semibold">{workflowName}</h1>
        </div>
      </div>

      <WorkflowToolbar 
        onRun={runWorkflow}
        onSave={handleSave}
        isRunning={isRunning}
        nodeCount={nodes.length}
        workflowName={workflowName}
        onWorkflowNameChange={setWorkflowName}
      />
      
      <div className="flex-1 flex">
        <ComponentSidebar onDragStart={onDragStart} />
        
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={connectNodes}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
            >
              <Controls />
              <Background />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
} 