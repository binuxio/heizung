import readJsonFile from "@/utils/db/readJsonFile";
import { Schedule } from "@/types/schedule.types";
import { scheduleJsonPath } from "@/dotenv";
import schedule_event from "./schedule_event";


export default async function () {
    const schedule = await readJsonFile<Schedule>(scheduleJsonPath)
    for (const day in schedule) {
        schedule_event(schedule[day])
        // for (const event of schedule[day]) {
        // }
    }
}