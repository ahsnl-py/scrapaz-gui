
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Database, Workflow } from "lucide-react";

export const OverviewCards = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-blue-700">
                        <Globe className="w-5 h-5 mr-2" />
                        Active Scrapers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-blue-800">12</div>
                    <p className="text-sm text-blue-600">Running workflows</p>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-purple-700">
                        <Database className="w-5 h-5 mr-2" />
                        Data Records
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-purple-800">45.2K</div>
                    <p className="text-sm text-purple-600">Total scraped records</p>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-green-700">
                        <Workflow className="w-5 h-5 mr-2" />
                        Workflows
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-green-800">8</div>
                    <p className="text-sm text-green-600">Automation pipelines</p>
                </CardContent>
            </Card>
        </div>
    );
}
