
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const historyData = [
  { id: "job_123", target: "https://example-store.com", status: "completed", records: 1250, timestamp: "2 hours ago" },
  { id: "job_122", target: "news-site.com/articles", status: "completed", records: 580, timestamp: "1 day ago" },
  { id: "job_121", target: "https://quotes.toscrape.com", status: "failed", records: 0, timestamp: "2 days ago" },
  { id: "job_120", target: "https://example-store.com/products", status: "running", records: 300, timestamp: "5 minutes ago" },
];

export const ScrapeHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredHistory = historyData.filter(item =>
    item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <CardTitle>Scraping History</CardTitle>
        <CardDescription>Review your previous and ongoing scraping jobs.</CardDescription>
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
                <TableHead>Job ID</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.target}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>{item.records.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{item.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
