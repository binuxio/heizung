import nodescheduler from "../../nodeScheduler";

export default function (id: string[]) {
    for (const jobId of id) {
        const startJobID = `start:${jobId}`
        const startJob = nodescheduler.scheduledJobs[startJobID]
        if (startJob) startJob.cancel()
        else console.error(`Cant cancel not existing Job. Given ID: "${startJobID}"`);

        const endJobID = `end:${id}`
        const endJob = nodescheduler.scheduledJobs[endJobID]
        if (endJob) endJob.cancel();
    }
}