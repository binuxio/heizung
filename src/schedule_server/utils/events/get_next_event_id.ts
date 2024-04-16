import nodeScheduler from "@/schedule_server/nodeScheduler";

export default function (): string | undefined {
    const jobs = nodeScheduler.scheduledJobs;

    if (!jobs || Object.keys(jobs).length === 0) {
        return undefined;
    }

    const jobsDate: { id: string, date: number }[] = [];

    for (const jobId in jobs) {
        if (jobId.includes("start")) {
            const job = jobs[jobId];
            jobsDate.push({ id: jobId, date: job.nextInvocation().getTime() });
        }
    }

    jobsDate.sort((a, b) => {
        return a.date - b.date;
    });

    const jobId = jobsDate[0] && jobsDate[0].id.split(":")[1] || undefined
    return jobId;
}
