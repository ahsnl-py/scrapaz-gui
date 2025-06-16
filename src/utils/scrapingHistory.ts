export type ScrapingJob = {
  id: string;
  source: string;
  type: "Web" | "File";
  status: "Completed" | "In Progress" | "Failed";
  timestamp: string;
  itemCount: number;
  data: Record<string, any>;
  jobId?: string; // API job ID for fetching results
  url?: string;
  cssSelector?: string;
  aiModelProvider?: string;
  extractionTime?: number;
  metadata?: Record<string, any>;
};

const STORAGE_KEY = 'scraping_history';

export const scrapingHistoryUtils = {
  // Get all jobs from localStorage
  getAllJobs: (): ScrapingJob[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading scraping history:', error);
      return [];
    }
  },

  // Save a new job
  saveJob: (job: ScrapingJob): void => {
    try {
      const jobs = scrapingHistoryUtils.getAllJobs();
      const existingIndex = jobs.findIndex(j => j.id === job.id);
      
      if (existingIndex >= 0) {
        // Update existing job
        jobs[existingIndex] = job;
      } else {
        // Add new job
        jobs.unshift(job); // Add to beginning of array
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch (error) {
      console.error('Error saving scraping job:', error);
    }
  },

  // Update job status
  updateJobStatus: (jobId: string, status: ScrapingJob['status'], data?: any): void => {
    try {
      const jobs = scrapingHistoryUtils.getAllJobs();
      const jobIndex = jobs.findIndex(j => j.jobId === jobId);
      
      if (jobIndex >= 0) {
        jobs[jobIndex].status = status;
        if (data) {
          jobs[jobIndex].data = data;
          jobs[jobIndex].itemCount = data.total_items || 0;
          jobs[jobIndex].extractionTime = data.extraction_time;
          jobs[jobIndex].metadata = data.metadata;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
      }
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  },

  // Delete jobs
  deleteJobs: (jobIds: string[]): void => {
    try {
      const jobs = scrapingHistoryUtils.getAllJobs();
      const filteredJobs = jobs.filter(job => !jobIds.includes(job.id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredJobs));
    } catch (error) {
      console.error('Error deleting jobs:', error);
    }
  },

  // Get job by ID
  getJobById: (id: string): ScrapingJob | undefined => {
    const jobs = scrapingHistoryUtils.getAllJobs();
    return jobs.find(job => job.id === id);
  }
};
