
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Play, Settings, Info, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SchemaField = {
  id: number;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
};

export const WebScrapeForm = () => {
  const [url, setUrl] = useState("https://quotes.toscrape.com/");
  const [cssSelector, setCssSelector] = useState(".quote");
  const [aiProvider, setAiProvider] = useState("groq");
  const [schemaFields, setSchemaFields] = useState<SchemaField[]>([
    { id: 1, name: 'quote', type: 'string' },
    { id: 2, name: 'author', type: 'string' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddField = () => {
    setSchemaFields([...schemaFields, { id: Date.now(), name: '', type: 'string' }]);
  };

  const handleRemoveField = (id: number) => {
    setSchemaFields(schemaFields.filter(field => field.id !== id));
  };

  const handleFieldChange = (id: number, key: 'name' | 'type', value: string) => {
    setSchemaFields(schemaFields.map(field => field.id === id ? { ...field, [key]: value } : field));
  };

  const handleStartScraping = async () => {
    if (!url) {
      toast({ title: "URL Required", description: "Please enter a URL to scrape", variant: "destructive" });
      return;
    }

    const properties = schemaFields.reduce((acc, field) => {
      if (field.name.trim()) {
        acc[field.name.trim()] = { type: field.type };
      }
      return acc;
    }, {} as Record<string, { type: string }>);

    if (Object.keys(properties).length === 0) {
      toast({ title: "Schema Required", description: "Please define at least one attribute for the data schema.", variant: "destructive" });
      return;
    }

    const dataSchema = {
      type: "object",
      properties,
    };

    setIsLoading(true);
    console.log({ url, cssSelector, aiProvider, dataSchema });
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "Scraping Started", description: `Successfully initiated scraping for ${url}` });
    }, 2000);
  };

  const renderTooltip = (text: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="w-4 h-4 text-muted-foreground ml-1.5 cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="url">Target URL</Label>
            {renderTooltip("The full URL of the website you want to scrape.")}
          </div>
          <Input id="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="css_selector">CSS Selector</Label>
            {renderTooltip("The CSS selector for the elements you want to extract.")}
          </div>
          <Input id="css_selector" placeholder=".product-item" value={cssSelector} onChange={(e) => setCssSelector(e.target.value)} />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="ai_provider">AI Model Provider</Label>
          {renderTooltip("The AI provider to use for data extraction and formatting.")}
        </div>
        <Select value={aiProvider} onValueChange={setAiProvider}>
          <SelectTrigger id="ai_provider"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="groq">Groq</SelectItem>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <Label>Data Schema</Label>
          {renderTooltip("Define the structure of your data. The schema will be auto-generated.")}
        </div>
        <div className="space-y-2 rounded-md border p-4">
            {schemaFields.map((field) => (
                <div key={field.id} className="flex items-center gap-2">
                    <Input 
                        placeholder="Attribute Name" 
                        value={field.name}
                        onChange={(e) => handleFieldChange(field.id, 'name', e.target.value)}
                    />
                    <Select value={field.type} onValueChange={(value) => handleFieldChange(field.id, 'type', value)}>
                        <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="object">Object</SelectItem>
                            <SelectItem value="array">Array</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveField(field.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddField}>
                <Plus className="w-4 h-4 mr-2" />
                Add Attribute
            </Button>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button onClick={handleStartScraping} disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Play className="w-4 h-4 mr-2" />
          {isLoading ? "Starting..." : "Start Scraping"}
        </Button>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Advanced Settings
        </Button>
      </div>
    </div>
  );
};
