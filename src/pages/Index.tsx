
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import DashboardPage from "./dashboard/DashboardPage";
import PageHeader from "@/components/layout/PageHeader";
import { ScrapingInterface } from "@/components/ScrapingInterface";
import { WorkflowBuilder } from "@/components/WorkflowBuilder";
import { DataManager } from "@/components/DataManager";
import { Globe, Workflow, Database, Home } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [projects] = useState([
    {
      id: 1,
      name: "E-commerce Product Data",
      url: "https://example-store.com",
      status: "active",
      lastRun: "2 hours ago",
      recordCount: 1250
    },
    {
      id: 2,
      name: "News Articles Scraper",
      url: "https://news-site.com",
      status: "paused",
      lastRun: "1 day ago",
      recordCount: 580
    }
  ]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const menuItems = [
    {
      id: "home",
      title: "Home",
      icon: Home,
    },
    {
      id: "scraper",
      title: "Web Scraper",
      icon: Globe,
    },
    {
      id: "workflow",
      title: "Workflow Builder",
      icon: Workflow,
    },
    {
      id: "data",
      title: "Data Manager",
      icon: Database,
    },
  ];

  const renderContent = () => {
    const activeItem = menuItems.find((item) => item.id === activeTab);
    const descriptions = {
      scraper: "Configure and run web scrapers",
      workflow: "Build and manage data processing workflows",
      data: "Manage and analyze your scraped data",
    };
    const description = descriptions[activeTab];

    switch (activeTab) {
      case "home":
        return <DashboardPage projects={projects} />;
      case "scraper":
        return (
          <>
            <PageHeader title={activeItem?.title || ''} description={description} />
            <ScrapingInterface />
          </>
        );
      case "workflow":
        return (
          <>
            <PageHeader title={activeItem?.title || ''} description={description} />
            <WorkflowBuilder />
          </>
        );
      case "data":
        return (
          <>
            <PageHeader title={activeItem?.title || ''} description={description} />
            <DataManager />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout
      menuItems={menuItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleLogout={handleLogout}
    >
      {renderContent()}
    </AppLayout>
  );
};

export default Index;
