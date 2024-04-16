import { _Event } from "@/types/schedule.types";
import start_event from "./start_program";
import nodeScheduler from "@/schedule_server/nodeScheduler";
import { getRecurrenceRule, getScheduledDate } from "../nodeScheduler_utils";

export default async function (event: _Event[]) {
    for (const ev of event) {
        const { start, end, id } = ev

        const startJobID = `start:${id}`
        const startDate = getRecurrenceRule(start)
        if (nodeScheduler.scheduledJobs[startJobID]) nodeScheduler.rescheduleJob(startJobID, startDate)
        else nodeScheduler.scheduleJob(startJobID, startDate, start_event.bind(null, id, start.day))

        const endJobID = `end:${id}`
        if (nodeScheduler.scheduledJobs[endJobID]) nodeScheduler.rescheduleJob(endJobID, getScheduledDate(end))
    }
}