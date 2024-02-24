import { EventMoments, _Event } from "../../types";

export default function (eventMoments: EventMoments[]): _Event[] {
    const events: _Event[] = eventMoments.map(eventMoment => {
        const startTime = eventMoment.startMoment.format("HH:mm")
        const endTime = eventMoment.endMoment.format("HH:mm")
        const endDate = eventMoment.endMoment.format("DD-MM-YYYY")

        if (eventMoment.isWeekly) {
            const startDay = eventMoment.startMoment.isoWeekday()
            return {
                start: {
                    day: startDay,
                    time: startTime
                },
                end: {
                    date: endDate,
                    time: endTime
                },
                _id: eventMoment._id,
                isWeekly: eventMoment.isWeekly
            }
        }

        const startDate = eventMoment.startMoment.format("DD-MM-YYYY")
        return {
            start: {
                date: startDate,
                time: startTime
            },
            end: {
                date: endDate,
                time: endTime
            },
            _id: eventMoment._id,
            isWeekly: eventMoment.isWeekly
        }
    })
    return events
}