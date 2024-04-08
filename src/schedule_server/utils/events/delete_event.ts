import nodescheduler from "../../nodeScheduler";

export default function (id: string | string[]) {
    if (!id) return

    if (typeof id === "string") {
        _deleteJob(id)

    } else if (Array.isArray(id)) {
        for (const jobId of id) {
            _deleteJob(jobId)
        }
    } else {
        throw new TypeError("Invalid ID type. Expected string or string array.");
    }
}

const _deleteJob = (id: string) => {
    const startJobID = `start:${id}`
    const startJob = nodescheduler.scheduledJobs[startJobID]
    if (startJob) startJob.cancel()
    else console.warn(`Job with ID "${startJobID}" not found.`);

    const endJobID = `end:${id}`
    const endJob = nodescheduler.scheduledJobs[endJobID]
    if (endJob) endJob.cancel();
}