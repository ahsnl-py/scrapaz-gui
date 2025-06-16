import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MoreHorizontal, Download, Trash2, Eye, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { scrapingHistoryUtils, ScrapingJob } from "@/utils/scrapingHistory";

export const ScrapeHistory = () => {
  const [jobs, setJobs] = useState<ScrapingJob[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load jobs from localStorage on component mount
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    const storedJobs = scrapingHistoryUtils.getAllJobs();
    setJobs(storedJobs);
  };

  const filteredJobs = jobs.filter(job =>
    job.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? filteredJobs.map(j => j.id) : []);
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;
    
    scrapingHistoryUtils.deleteJobs(selectedRows);
    setSelectedRows([]);
    loadJobs();
    toast({ title: "Jobs Deleted", description: `Deleted ${selectedRows.length} job(s)` });
  };

  const handleDownloadSelected = () => {
    if (selectedRows.length === 0) return;
    
    const selectedJobs = jobs.filter(job => selectedRows.includes(job.id));
    const downloadData = {
      jobs: selectedJobs,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(downloadData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scraping_history_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({ title: "Download Complete", description: "Selected jobs have been downloaded." });
  };

  const handleRefreshJob = async (job: ScrapingJob) => {
    if (!job.jobId) {
      toast({ title: "Error", description: "No job ID available for this entry", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://0.0.0.0:8000/api/v1/jobs/${job.jobId}`, {
        method: 'GET',
        headers: { 'accept': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to fetch job status');

      const jobStatus = await response.json();
      
      if (jobStatus.status === 'completed') {
        // Fetch the actual data
        const resultResponse = await fetch(`http://0.0.0.0:8000/api/v1/jobs/${job.jobId}/result`, {
          method: 'GET',
          headers: { 'accept': 'application/json' }
        });

        if (resultResponse.ok) {
          const resultData = await resultResponse.json();
          scrapingHistoryUtils.updateJobStatus(job.jobId, 'Completed', resultData);
          loadJobs();
          toast({ title: "Job Updated", description: "Job data has been refreshed" });
        }
      } else {
        scrapingHistoryUtils.updateJobStatus(job.jobId, jobStatus.status === 'failed' ? 'Failed' : 'In Progress');
        loadJobs();
        toast({ title: "Status Updated", description: `Job status: ${jobStatus.status}` });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to refresh job", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const isAllSelected = selectedRows.length === filteredJobs.length && filteredJobs.length > 0;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < filteredJobs.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Scraping History</CardTitle>
          <CardDescription>Review and manage your past scraping jobs.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Search by source..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" size="icon" onClick={loadJobs} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" disabled={selectedRows.length === 0}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownloadSelected}>
                <Download className="mr-2 h-4 w-4" />
                Download Selected
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={handleDeleteSelected}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                  checked={isAllSelected ? true : (isSomeSelected ? "indeterminate" : false)}
                  aria-label="Select all rows"
                />
              </TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.map((job) => (
              <TableRow key={job.id} data-state={selectedRows.includes(job.id) && "selected"}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(job.id)}
                    onCheckedChange={(checked) => {
                      setSelectedRows(
                        checked
                          ? [...selectedRows, job.id]
                          : selectedRows.filter((id) => id !== job.id)
                      );
                    }}
                    aria-label={`Select row ${job.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{job.source}</TableCell>
                <TableCell>{job.type}</TableCell>
                <TableCell>
                  <Badge variant={
                    job.status === "Completed" ? "default" :
                    job.status === "Failed" ? "destructive" :
                    "secondary"
                  }>
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>{job.itemCount}</TableCell>
                <TableCell>{job.timestamp}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={job.status !== 'Completed'}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Data Preview: {job.source}</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4 rounded-md bg-muted p-4 max-h-[80vh] overflow-y-auto">
                          <pre className="text-sm">
                            {JSON.stringify(job.data, null, 2)}
                          </pre>
                        </div>
                      </SheetContent>
                    </Sheet>
                    {job.jobId && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRefreshJob(job)}
                        disabled={isLoading}
                      >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
