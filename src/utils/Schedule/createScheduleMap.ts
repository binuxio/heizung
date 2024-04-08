import { Schedule, ScheduleMap, _Event } from "../../types/schedule.types"

export default function (schedule: Schedule): ScheduleMap {
    const scheduleMap = new Map()
    for (let day = 0; day < 7; day++) {
        scheduleMap.set(day, schedule[day] || [])
    }
    return scheduleMap
}