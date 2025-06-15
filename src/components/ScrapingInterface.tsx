
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Globe, File } from "lucide-react";
import { WebScrapeForm } from "./WebScrapeForm";
import { FileScrapeForm } from "./FileScrapeForm";
import { ScrapeHistory } from "./ScrapeHistory";

type ScrapeType = "web" | "file";

const scrapeTypes = [
  { id: "web", label: "Web", icon: Globe },
  { id: "file", label: "File", icon: File },
] as const;

export const ScrapingInterface = () => {
  const [activeScrapeType, setActiveScrapeType] = useState<ScrapeType>("web");

  const renderConfiguration = () => {
    if (activeScrapeType === "web") {
      return <WebScrapeForm />;
    } else {
      return <FileScrapeForm />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Scraping Configuration</CardTitle>
          <CardDescription>Select a source type and configure your scraper.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-2">
            <Label>Source Type</Label>
            <div className="flex flex-wrap gap-2">
              {scrapeTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={activeScrapeType === type.id ? "default" : "outline"}
                  onClick={() => setActiveScrapeType(type.id)}
                  className={activeScrapeType === type.id ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : ""}
                >
                  <type.icon className="w-4 h-4 mr-2" />
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
          {renderConfiguration()}
        </CardContent>
      </Card>

      {/* Scraping History */}
      <ScrapeHistory />
    </div>
  );
};
