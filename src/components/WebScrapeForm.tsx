
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Play, Settings, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const defaultSchema = JSON.stringify({
  type: "object",
  properties: {
    quote: { type: "string" },
    author: { type: "string" },
  },
}, null, 2);

export const WebScrapeForm = () => {
  const [url, setUrl] = useState("https://quotes.toscrape.com/");
  const [cssSelector, setCssSelector] = useState(".quote");
  const [aiProvider, setAiProvider] = useState("groq");
  const [dataSchema, setDataSchema] = useState(defaultSchema);
  const [storageType, setStorageType] = useState("database");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStartScraping = async () => {
    if (!url) {
      toast({ title: "URL Required", description: "Please enter a URL to scrape", variant: "destructive" });
      return;
    }
    try {
      JSON.parse(dataSchema);
    } catch (error) {
      toast({ title: "Invalid JSON Schema", description: "Please provide a valid JSON in the data schema.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    console.log({ url, cssSelector, aiProvider, dataSchema: JSON.parse(dataSchema), storageType });
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Label htmlFor="storage_type">Storage Type</Label>
            {renderTooltip("Where to store the scraped data.")}
          </div>
          <Select value={storageType} onValueChange={setStorageType}>
            <SelectTrigger id="storage_type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="database">Database</SelectItem>
              <SelectItem value="json">JSON File</SelectItem>
              <SelectItem value="csv">CSV File</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="data_schema">Data Schema (JSON)</Label>
          {renderTooltip("Define the structure of your data in JSON format.")}
        </div>
        <Textarea
          id="data_schema"
          placeholder='{ "type": "object", "properties": { ... } }'
          value={dataSchema}
          onChange={(e) => setDataSchema(e.target.value)}
          className="min-h-[120px] font-mono text-sm"
        />
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
