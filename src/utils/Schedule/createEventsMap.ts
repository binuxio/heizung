import { Schedule, _Event } from "../../types/schedule.types"

export const ScheduleMap = new Map<number, _Event[]>()

export default function (schedule: Schedule = []) {
    for (let day = 0; day < 7; day++) {
        ScheduleMap.set(day, schedule[day] || [])
    }
}