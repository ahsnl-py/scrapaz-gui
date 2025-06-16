import { Card, CardContent } from "@/components/ui/card";
import { WorkflowComponent } from "./types";
import { WORKFLOW_COMPONENTS } from "./constants";

interface ComponentSidebarProps {
  onDragStart: (event: React.DragEvent, component: WorkflowComponent) => void;
}

export const ComponentSidebar = ({ onDragStart }: ComponentSidebarProps) => {
  return (
    <div className="w-64 bg-background border-r border-border overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Workflow Components</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Drag components to the canvas to build your workflow
        </p>
        
        {WORKFLOW_COMPONENTS.map((group) => (
          <div key={group.name} className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3 border-b pb-2">
              {group.name}
            </h3>
            <div className="space-y-2">
              {group.components.map((component) => {
                const Icon = component.icon;
                return (
                  <Card
                    key={component.id}
                    className="cursor-grab hover:shadow-md transition-shadow border-dashed border-2 border-border hover:border-primary/50"
                    draggable
                    onDragStart={(e) => onDragStart(e, component)}
                    aria-label={`Drag ${component.name} to canvas`}
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
  );
}; 