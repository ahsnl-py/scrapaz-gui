
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";

export const FileScrapeForm = ({ fileType }: { fileType: string }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Upload a <span className="font-semibold text-primary">{fileType.toUpperCase()}</span> file to extract data.
      </p>
      <div className="space-y-2">
        <Label htmlFor="file-upload">Choose File</Label>
        <Input id="file-upload" type="file" />
      </div>
      <Button>
        <UploadCloud className="w-4 h-4 mr-2" />
        Upload and Process
      </Button>
    </div>
  );
};
