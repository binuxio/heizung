import { _Event } from "@/types/schedule.types";
import nodescheduler from "@/schedule_server/nodeScheduler";
import { getRecurrenceRule } from "../nodeScheduler_utils";

export default async function (id: string, date: { time: string, day: number }) {
    if (nodescheduler.scheduledJobs[id])
        nodescheduler.rescheduleJob(id, getRecurrenceRule(date))
    else console.warn("Can't reschedule not existing job. Given ID:", id)
}