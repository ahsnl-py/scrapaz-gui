import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Play, Info, Plus, Trash2, RotateCcw, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { scrapingHistoryUtils, ScrapingJob } from "@/utils/scrapingHistory";

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
    { id: 1, name: 'text', type: 'string' },
    { id: 2, name: 'author', type: 'string' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [scrapedData, setScrapedData] = useState<any>(null);
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

  const handleClearForm = () => {
    setUrl("https://quotes.toscrape.com/");
    setCssSelector(".quote");
    setAiProvider("groq");
    setSchemaFields([
      { id: 1, name: 'text', type: 'string' },
      { id: 2, name: 'author', type: 'string' },
    ]);
    toast({ title: "Form Cleared", description: "All fields have been reset to their default values." });
  };

  const createScrapingJob = async (jobData: any) => {
    const response = await fetch('http://0.0.0.0:8000/api/v1/jobs', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create job: ${response.statusText}`);
    }

    return await response.json();
  };

  const checkJobStatus = async (jobId: string): Promise<any> => {
    const response = await fetch(`http://0.0.0.0:8000/api/v1/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to check job status: ${response.statusText}`);
    }

    return await response.json();
  };

  const getJobResult = async (jobId: string): Promise<any> => {
    const response = await fetch(`http://0.0.0.0:8000/api/v1/jobs/${jobId}/result`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get job result: ${response.statusText}`);
    }

    return await response.json();
  };

  const downloadJsonFile = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

    try {
      // Step 1: Create scraping job
      const jobData = {
        url,
        css_selector: cssSelector,
        ai_model_provider: aiProvider,
        data_schema: dataSchema,
        storage_type: "memory"
      };

      const jobResponse = await createScrapingJob(jobData);
      const newJobId = jobResponse.id;
      setJobId(newJobId);

      // Save initial job to history
      const historyJob: ScrapingJob = {
        id: `job-${Date.now()}`, // Generate a unique ID for history
        jobId: newJobId, // Store the API job ID
        source: new URL(url).hostname,
        type: "Web",
        status: "In Progress",
        timestamp: new Date().toLocaleString(),
        itemCount: 0,
        data: {},
        url: url,
        cssSelector: cssSelector,
        aiModelProvider: aiProvider
      };
      
      scrapingHistoryUtils.saveJob(historyJob);

      toast({ title: "Job Created", description: `Scraping job started with ID: ${newJobId}` });

      // Step 2: Poll for job completion
      let jobStatus = "pending";
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes with 5-second intervals

      while (jobStatus !== "completed" && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        const statusResponse = await checkJobStatus(newJobId);
        jobStatus = statusResponse.status;
        attempts++;

        if (jobStatus === "failed") {
          throw new Error(statusResponse.error_message || "Job failed");
        }
      }

      if (jobStatus !== "completed") {
        throw new Error("Job timed out");
      }

      // Step 3: Get job result
      const resultResponse = await getJobResult(newJobId);
      setScrapedData(resultResponse);

      // Update history with completed data
      scrapingHistoryUtils.updateJobStatus(newJobId, "Completed", resultResponse);

      setIsLoading(false);
      toast({ title: "Scraping Complete!", description: `Successfully scraped ${resultResponse.total_items} items from ${url}` });
      setIsDialogOpen(true);

    } catch (error) {
      // Update history with failed status
      if (jobId) {
        scrapingHistoryUtils.updateJobStatus(jobId, "Failed");
      }
      
      setIsLoading(false);
      toast({ 
        title: "Scraping Failed", 
        description: error instanceof Error ? error.message : "An unexpected error occurred", 
        variant: "destructive" 
      });
    }
  };

  const handleDownload = () => {
    if (scrapedData && jobId) {
      const filename = `scraped_data_${jobId}_${new Date().toISOString().split('T')[0]}.json`;
      downloadJsonFile(scrapedData, filename);
      toast({ title: "Download Started", description: "Your file is being downloaded." });
      setIsDialogOpen(false);
    }
  };

  const handleSaveToDataManager = () => {
    if (scrapedData) {
      // TODO: Implement saving to data manager
      toast({ title: "Saving...", description: "Data is being saved to the Data Manager." });
      setIsDialogOpen(false);
    }
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
          {isLoading ? "Scraping..." : "Start Scraping"}
        </Button>
        <Button variant="outline" onClick={handleClearForm} disabled={isLoading}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          toast({
            title: "Data Not Saved",
            description: "The scraped data will be lost.",
            variant: "destructive"
          });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scraping Complete</DialogTitle>
            <DialogDescription>
              Successfully scraped {scrapedData?.total_items || 0} items from {url}. 
              What would you like to do with the data?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start gap-2 pt-4">
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </Button>
            <Button variant="secondary" onClick={handleSaveToDataManager}>
              Save to Data Manager
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
