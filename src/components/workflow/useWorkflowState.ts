import { useCallback, useState } from "react";
import { useNodesState, useEdgesState, addEdge, Connection, Node } from "reactflow";
import { WorkflowComponent, WorkflowNodeData } from "./types";

export const useWorkflowState = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addNode = useCallback((component: WorkflowComponent, position: { x: number; y: number }) => {
    const newNode: Node<WorkflowNodeData> = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "workflow-node",
      position,
      data: {
        type: component.type,
        label: component.name,
        description: component.description,
        onDelete: (nodeId: string) => deleteNode(nodeId),
        onEdit: (nodeId: string) => editNode(nodeId),
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const editNode = useCallback((nodeId: string) => {
    // TODO: Implement node editing functionality
    console.log("Edit node:", nodeId);
  }, []);

  const connectNodes = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const runWorkflow = useCallback(async () => {
    setIsRunning(true);
    try {
      // TODO: Implement workflow execution logic
      console.log("Running workflow with nodes:", nodes);
      console.log("And edges:", edges);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate execution
    } catch (error) {
      console.error("Workflow execution failed:", error);
    } finally {
      setIsRunning(false);
    }
  }, [nodes, edges]);

  const saveWorkflow = useCallback(() => {
    const workflowData = {
      nodes,
      edges,
      metadata: {
        name: "My Workflow",
        createdAt: new Date().toISOString(),
        version: "1.0.0"
      }
    };
    
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  return {
    nodes,
    edges,
    isRunning,
    onNodesChange,
    onEdgesChange,
    addNode,
    deleteNode,
    editNode,
    connectNodes,
    runWorkflow,
    saveWorkflow,
  };
}; 