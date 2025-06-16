import { useCallback, useRef } from "react";
import ReactFlow, {
  Controls,
  Background,
  ReactFlowProvider,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { useWorkflowState } from "./workflow/useWorkflowState";
import { WorkflowNode } from "./workflow/WorkflowNode";
import { ComponentSidebar } from "./workflow/ComponentSidebar";
import { WorkflowToolbar } from "./workflow/WorkflowToolbar";
import { nodeTypes } from "./workflow/nodeTypes";
import { WorkflowComponent } from "./workflow/types";

export function WorkflowEditor() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
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

  return (
    <div className="h-screen flex flex-col">
      <WorkflowToolbar 
        onRun={runWorkflow}
        onSave={saveWorkflow}
        isRunning={isRunning}
        nodeCount={nodes.length}
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
