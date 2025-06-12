
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, Search, Download, Filter, RefreshCcw } from "lucide-react";

export const DataManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDataset, setSelectedDataset] = useState("1");
  
  const datasets = [
    {
      id: 1,
      name: "E-commerce Products",
      source: "shop.example.com",
      records: 1250,
      lastUpdated: "2 hours ago",
      format: "JSON",
      size: "2.4 MB"
    },
    {
      id: 2,
      name: "News Articles",
      source: "news.example.com",
      records: 580,
      lastUpdated: "1 day ago",
      format: "CSV",
      size: "1.8 MB"
    },
    {
      id: 3,
      name: "Social Media Posts",
      source: "social.example.com",
      records: 2100,
      lastUpdated: "3 hours ago",
      format: "JSON",
      size: "5.2 MB"
    }
  ];

  const datasetPreviews = {
    "1": [
      { id: 1, title: "Wireless Headphones", price: "$99.99", category: "Electronics", stock: 45 },
      { id: 2, title: "Running Shoes", price: "$129.99", category: "Sports", stock: 23 },
      { id: 3, title: "Coffee Maker", price: "$79.99", category: "Home", stock: 12 },
      { id: 4, title: "Smartphone Case", price: "$24.99", category: "Electronics", stock: 78 },
      { id: 5, title: "Yoga Mat", price: "$39.99", category: "Sports", stock: 34 }
    ],
    "2": [
      { id: 1, headline: "Tech Industry Updates", author: "John Smith", category: "Technology", publishDate: "2024-01-15" },
      { id: 2, headline: "Climate Change Report", author: "Jane Doe", category: "Environment", publishDate: "2024-01-14" },
      { id: 3, headline: "Market Analysis Today", author: "Bob Wilson", category: "Finance", publishDate: "2024-01-13" },
      { id: 4, headline: "Sports Championship", author: "Alice Brown", category: "Sports", publishDate: "2024-01-12" },
      { id: 5, headline: "Health & Wellness Tips", author: "David Lee", category: "Health", publishDate: "2024-01-11" }
    ],
    "3": [
      { id: 1, username: "@user123", content: "Great product launch today!", likes: 245, shares: 12 },
      { id: 2, username: "@techguru", content: "AI is changing everything", likes: 892, shares: 45 },
      { id: 3, username: "@fashionista", content: "New collection is amazing", likes: 156, shares: 8 },
      { id: 4, username: "@foodie", content: "Best restaurant in town", likes: 321, shares: 23 },
      { id: 5, username: "@traveler", content: "Beautiful sunset in Bali", likes: 567, shares: 34 }
    ]
  };

  const renderTableHeaders = () => {
    switch (selectedDataset) {
      case "1":
        return (
          <>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
          </>
        );
      case "2":
        return (
          <>
            <TableHead>ID</TableHead>
            <TableHead>Headline</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Publish Date</TableHead>
          </>
        );
      case "3":
        return (
          <>
            <TableHead>ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead>Shares</TableHead>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    const data = datasetPreviews[selectedDataset] || [];
    
    return data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.id}</TableCell>
        {selectedDataset === "1" && (
          <>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell>
              <Badge variant="outline">{item.category}</Badge>
            </TableCell>
            <TableCell>{item.stock}</TableCell>
          </>
        )}
        {selectedDataset === "2" && (
          <>
            <TableCell className="font-medium">{item.headline}</TableCell>
            <TableCell>{item.author}</TableCell>
            <TableCell>
              <Badge variant="outline">{item.category}</Badge>
            </TableCell>
            <TableCell>{item.publishDate}</TableCell>
          </>
        )}
        {selectedDataset === "3" && (
          <>
            <TableCell className="font-medium">{item.username}</TableCell>
            <TableCell>{item.content}</TableCell>
            <TableCell>{item.likes}</TableCell>
            <TableCell>{item.shares}</TableCell>
          </>
        )}
      </TableRow>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Datasets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{datasets.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {datasets.reduce((sum, dataset) => sum + dataset.records, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9.4 MB</div>
          </CardContent>
        </Card>
      </div>

      {/* Dataset Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Your Datasets
          </CardTitle>
          <CardDescription>Manage and export your scraped data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search datasets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="space-y-3">
            {datasets.map((dataset) => (
              <div key={dataset.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{dataset.name}</h3>
                    <p className="text-sm text-muted-foreground">{dataset.source}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{dataset.records.toLocaleString()} records</p>
                    <p className="text-xs text-muted-foreground">{dataset.lastUpdated} • {dataset.size}</p>
                  </div>
                  <Badge variant="outline">{dataset.format}</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
          <CardDescription>Sample records from your selected dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedDataset} onValueChange={setSelectedDataset}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select dataset to preview" />
              </SelectTrigger>
              <SelectContent>
                {datasets.map((dataset) => (
                  <SelectItem key={dataset.id} value={dataset.id.toString()}>
                    {dataset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                {renderTableHeaders()}
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
          
          <div className="flex justify-center mt-4">
            <Button variant="outline">Load More Records</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
