import { _Event } from "@/types/schedule.types";
import reschedule_event from "./reschedule_event";
import start_event from "./start_event";
import nodeScheduler from "@/schedule_server/nodeScheduler";
import { getRecurrenceRule, getScheduledDate } from "../nodeScheduler_utils";

export default async function (event: _Event | _Event[]) {
    if (Array.isArray(event)) {
        for (const ev of event) {
            const { start, end, id } = ev
            const startJobID = `start:${id}`

            if (nodeScheduler.scheduledJobs[startJobID]) reschedule_event(id, start)
            else nodeScheduler.scheduleJob(startJobID, getRecurrenceRule(start), start_event.bind(null, id, start.day))

            const endJobID = `end:${id}`
            const endJob = nodeScheduler.scheduledJobs[endJobID]
            if (endJob) nodeScheduler.rescheduleJob(endJobID, getScheduledDate(ev.end))
        }
    }
    else if (event && typeof event === 'object') {
        const { start, end, id } = event
        const startJobID = `start:${id}`
        const endJobID = `end:${id}`

        // if (nodescheduler.scheduledJobs[startJobID]) reschedule_event(id, start)
        // else nodescheduler.scheduleJob(startJobID, getRecurrenceRule(start), event_start_job)

        // if (nodescheduler.scheduledJobs[endJobID]) reschedule_event(id, end)
        // else nodescheduler.scheduleJob(endJobID, getRecurrenceRule(end), event_end_job)
    } else {
        throw new TypeError("Invalid event type. Expected _Event or _Event array.");
    }
    console.log("scheduled event. New events", nodeScheduler.scheduledJobs)
}

/*  TODO:

the endJob must be scheduled in the startJob. The endJobs data should then be taken from the db. 
because the user could change the end time and it wil be triggered again without the start job has started
*/
