import readJsonFile from "@/utils/db/readJsonFile";
import { Schedule } from "@/types/schedule.types";
import { scheduleJsonPath } from "@/dotenv";
import schedule_events from "./schedule_events";


export default async function (): Promise<any> {
    const schedule = await readJsonFile<Schedule>(scheduleJsonPath)
    await new Promise(res => {
        for (const day in schedule) {
            schedule_events(schedule[day])
        }
        res("")
    })
    return
}