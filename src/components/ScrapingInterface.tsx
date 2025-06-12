
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Play, Settings, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ScrapingInterface = () => {
  const [url, setUrl] = useState("");
  const [selectors, setSelectors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStartScraping = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to scrape",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate scraping process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Scraping Started",
        description: `Successfully initiated scraping for ${url}`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Scraping Configuration
          </CardTitle>
          <CardDescription>Configure your web scraping parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="url">Target URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Scraping Method</Label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard HTTP</SelectItem>
                  <SelectItem value="js">JavaScript Rendering</SelectItem>
                  <SelectItem value="api">API Extraction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="selectors">CSS Selectors / XPath</Label>
            <Textarea
              id="selectors"
              placeholder="Enter CSS selectors or XPath expressions..."
              value={selectors}
              onChange={(e) => setSelectors(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Output Format</Label>
              <Select defaultValue="json">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delay">Delay (ms)</Label>
              <Input id="delay" placeholder="1000" type="number" />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handleStartScraping} 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Play className="w-4 h-4 mr-2" />
              {isLoading ? "Starting..." : "Start Scraping"}
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Advanced Settings
            </Button>
            <Button variant="outline">
              <Code className="w-4 h-4 mr-2" />
              Test Selectors
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Results */}
      <Card>
        <CardHeader>
          <CardTitle>Preview Results</CardTitle>
          <CardDescription>Sample data from your scraping configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">3 fields detected</Badge>
              <Badge variant="outline">15 records found</Badge>
            </div>
            
            <div className="border rounded-lg p-4 bg-slate-50">
              <pre className="text-sm overflow-x-auto">
{`{
  "title": "Sample Product Title",
  "price": "$29.99",
  "rating": "4.5",
  "availability": "In Stock",
  "description": "Product description text..."
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
