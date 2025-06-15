
import PageHeader from "@/components/layout/PageHeader";
import { OverviewCards } from "./OverviewCards";
import { RecentProjects } from "./RecentProjects";

type Project = {
    id: number;
    name: string;
    url: string;
    status: string;
    lastRun: string;
    recordCount: number;
};

interface DashboardPageProps {
    projects: Project[];
}

const DashboardPage = ({ projects }: DashboardPageProps) => {
    return (
        <>
            <PageHeader title="Home" description="Overview of your data engineering activities" />
            <div className="space-y-6">
                <OverviewCards />
                <RecentProjects projects={projects} />
            </div>
        </>
    );
};

export default DashboardPage;
