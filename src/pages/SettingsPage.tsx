
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast as sonnerToast } from "sonner";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const SettingsPage = () => {
    const [apiKey, setApiKey] = useState(localStorage.getItem("ai_api_key") || "");

    const handleSaveApiKey = () => {
        sonnerToast.warning("Security Warning", {
            description: "Storing API keys in browser storage is not secure. For better security, please integrate a backend service.",
        });
        localStorage.setItem("ai_api_key", apiKey);
        sonnerToast.success("API Key saved locally.");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-4">
                    <Button asChild variant="ghost" className="pl-0">
                        <Link to="/">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
                
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="profile">Account Profile</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Profile</CardTitle>
                                <CardDescription>This information is for display purposes.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" defaultValue="Demo User" readOnly />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" defaultValue="demo@example.com" readOnly />
                                </div>
                                <p className="text-sm text-muted-foreground pt-2">User profiles are read-only. To enable editing, please connect a database.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>General Settings</CardTitle>
                                <CardDescription>Manage application settings, like API keys and storage.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold">API Keys</h3>
                                    <Label htmlFor="api-key">AI Model API Key</Label>
                                    <div className="flex items-center space-x-2">
                                        <Input 
                                            id="api-key" 
                                            type="password" 
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="Enter your AI model API key"
                                        />
                                        <Button onClick={handleSaveApiKey}>Save</Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Your API key is stored in your browser. This is not secure and not recommended for production.
                                    </p>
                                </div>
                                <div className="space-y-2 border-t pt-6">
                                    <h3 className="font-semibold">Storage</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Storage management options will be available here once a backend is connected.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default SettingsPage;
