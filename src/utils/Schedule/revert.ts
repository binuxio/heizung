import { EventMoment, _Event } from "../../types/schedule.types";

export default function (eventMoments: EventMoment[]): _Event[] {
    const events: _Event[] = eventMoments.map(eventMoment => {
        const startTime = eventMoment.startMoment.format("HH:mm")
        const endTime = eventMoment.endMoment.format("HH:mm")
        const day = eventMoment.startMoment.isoWeekday()

        return {
            start: {
                day: day,
                time: startTime
            },
            end: {
                time: endTime
            },
            _id: eventMoment._id!
        }
    })
    return events
}