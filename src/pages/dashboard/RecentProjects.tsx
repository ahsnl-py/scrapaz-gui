
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Play } from "lucide-react";

type Project = {
    id: number;
    name: string;
    url: string;
    status: string;
    lastRun: string;
    recordCount: number;
};

interface RecentProjectsProps {
    projects: Project[];
}

export const RecentProjects = ({ projects }: RecentProjectsProps) => {
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your latest scraping projects and their status</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{project.name}</h3>
                                    <p className="text-sm text-muted-foreground">{project.url}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Badge variant={project.status === "active" ? "default" : "secondary"}>
                                    {project.status}
                                </Badge>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{project.recordCount.toLocaleString()} records</p>
                                    <p className="text-xs text-muted-foreground">Last run: {project.lastRun}</p>
                                </div>
                                <Button size="sm" variant="outline">
                                    <Play className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
