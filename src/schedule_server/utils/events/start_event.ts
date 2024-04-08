import { scheduleJsonPath } from "@/dotenv"
import nodeScheduler from "@/schedule_server/nodeScheduler"
import { Schedule, _Event } from "@/types/schedule.types"
import readJsonFile from "@/utils/db/readJsonFile"
import { getScheduledDate } from "../nodeScheduler_utils"
import { turnOffRelais, turnOnRelais } from "../relais_jobs"

export default async function (id: string, day: number) {
    console.log("start Job")
    turnOnRelais()
    const schedule = await readJsonFile<Schedule>(scheduleJsonPath)
    const event = schedule[day].find(ev => ev.id = id)
    if (event) {
        console.log("init end job")
        const endJobID = `end:${id}`
        nodeScheduler.scheduleJob(endJobID, getScheduledDate(event.end), turnOffRelais)
        console.log(nodeScheduler.scheduledJobs[endJobID])
    }
}