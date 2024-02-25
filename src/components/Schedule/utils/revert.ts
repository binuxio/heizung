import { EventMoments, _Event } from "../../types.schedule";

export default function (eventMoments: EventMoments[]): _Event[] {
    const events: _Event[] = eventMoments.map(eventMoment => {
        const startTime = eventMoment.startMoment.format("HH:mm")
        const endTime = eventMoment.endMoment.format("HH:mm")

        if (eventMoment.isWeekly) {
            const startDay = eventMoment.startMoment.isoWeekday()
            return {
                start: {
                    day: startDay,
                    time: startTime
                },
                end: {
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
                time: endTime
            },
            _id: eventMoment._id,
            isWeekly: eventMoment.isWeekly
        }
    })
    return events
}