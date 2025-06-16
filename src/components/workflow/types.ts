import { ReactNode } from "react";

export interface WorkflowComponent {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  type: string;
}

export interface WorkflowNodeData {
  type: string;
  label?: string;
  description?: string;
  onDelete: (nodeId: string) => void;
  onEdit?: (nodeId: string, newName?: string) => void;
}

export interface ComponentGroup {
  name: string;
  components: WorkflowComponent[];
}

export interface WorkflowMetadata {
  name: string;
  createdAt: string;
  version: string;
}

export interface WorkflowData {
  nodes: any[];
  edges: any[];
  metadata: WorkflowMetadata;
} 