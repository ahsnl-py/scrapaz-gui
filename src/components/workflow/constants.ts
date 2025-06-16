import { 
  Database, 
  FileText, 
  Globe, 
  Filter, 
  Bot, 
  Cloud 
} from "lucide-react";
import { ComponentGroup } from "./types";

export const WORKFLOW_COMPONENTS: ComponentGroup[] = [
  {
    name: "ETL Basic Tools",
    components: [
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
    ]
  },
  {
    name: "Agent Tools",
    components: [
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
  }
]; 