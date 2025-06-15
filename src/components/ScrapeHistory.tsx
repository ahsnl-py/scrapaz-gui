
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, Download, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const historyData = [
  { id: "job_123", target: "https://quotes.toscrape.com", status: "completed", records: 2, timestamp: "2 hours ago", scrapedData: [{ quote: "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.", author: "Albert Einstein"}, { quote: "It is our choices, Harry, that show what we truly are, far more than our abilities.", author: "J.K. Rowling"}] },
  { id: "job_122", target: "news-site.com/articles", status: "completed", records: 580, timestamp: "1 day ago", scrapedData: [{ title: "Breaking News", content: "..."}] },
  { id: "job_121", target: "https://example.com", status: "failed", records: 0, timestamp: "2 days ago", scrapedData: null },
  { id: "job_120", target: "https://example-store.com/products", status: "running", records: 300, timestamp: "5 minutes ago", scrapedData: null },
];

export const ScrapeHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredHistory = historyData.filter(item =>
    item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredHistory.map(item => item.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(id);
    } else {
      newSelectedRows.delete(id);
    }
    setSelectedRows(newSelectedRows);
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "running": return "secondary";
      case "failed": return "destructive";
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="space-y-1.5">
                <CardTitle>Scraping History</CardTitle>
                <CardDescription>Review your previous and ongoing scraping jobs.</CardDescription>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={selectedRows.size === 0}>
                        Actions
                        <MoreHorizontal className="w-4 h-4 ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Selected
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by target or job ID..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    aria-label="Select all"
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                    checked={selectedRows.size > 0 && selectedRows.size === filteredHistory.length}
                    indeterminate={selectedRows.size > 0 && selectedRows.size < filteredHistory.length}
                  />
                </TableHead>
                <TableHead>Job ID</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-center">Preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id} data-state={selectedRows.has(item.id) && "selected"}>
                  <TableCell>
                    <Checkbox 
                      aria-label={`Select row ${item.id}`}
                      onCheckedChange={(checked) => handleSelectRow(item.id, Boolean(checked))}
                      checked={selectedRows.has(item.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.target}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>{item.records.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{item.timestamp}</TableCell>
                  <TableCell className="text-center">
                    {item.scrapedData ? (
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Preview data</span>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Data Preview</SheetTitle>
                              <SheetDescription>
                                Job ID: {item.id}
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-4 rounded-md bg-muted p-4 h-[calc(100vh-10rem)] overflow-auto">
                                <pre className="text-sm">
                                    {JSON.stringify(item.scrapedData, null, 2)}
                                </pre>
                            </div>
                          </SheetContent>
                        </Sheet>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
