import { Schedule, _Event } from "../../types.schedule"

export const eventsMap = new Map<number | string, _Event[]>()

export default function (schedule: Schedule = []) {
    schedule.forEach(event => {
        //@ts-ignore
        const day = event.start.day
        //@ts-ignore
        const date = event.start.date

        if (day) {
            if (eventsMap.has(day)) {
                const events = eventsMap.get(day)
                events!.push(event)
            } else eventsMap.set(day, [event])

        } else if (date) {
            if (eventsMap.has(date)) {
                const events = eventsMap.get(date)
                events!.push(event)
            } else eventsMap.set(date, [event])
        }
    })
}