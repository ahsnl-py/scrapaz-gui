import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MoreHorizontal, Download, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Job = {
  id: string;
  source: string;
  type: "Web" | "File";
  status: "Completed" | "In Progress" | "Failed";
  timestamp: string;
  itemCount: number;
  data: Record<string, any>;
};

const jobs: Job[] = [
  { id: "job-1", source: "quotes.toscrape.com", type: "Web", status: "Completed", timestamp: "2024-05-20 10:30 AM", itemCount: 10, data: { quotes: [{ quote: "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.", author: "Albert Einstein" }] } },
  { id: "job-2", source: "books.toscrape.com", type: "Web", status: "Completed", timestamp: "2024-05-19 03:45 PM", itemCount: 50, data: { books: [{ title: "A Light in the Attic" }] } },
  { id: "job-3", source: "monthly_report.pdf", type: "File", status: "Failed", timestamp: "2024-05-18 09:00 AM", itemCount: 0, data: {} },
  { id: "job-4", source: "inventory.xlsx", type: "File", status: "In Progress", timestamp: "2024-05-20 11:00 AM", itemCount: 1500, data: {} },
];

export const ScrapeHistory = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter(job =>
    job.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? filteredJobs.map(j => j.id) : []);
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" disabled={selectedRows.length === 0}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download Selected
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
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
              <TableHead className="text-right">Preview</TableHead>
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
                        <pre>
                          {JSON.stringify(job.data, null, 2)}
                        </pre>
                      </div>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
