import moment from "moment";
import { _Event } from "../../types.schedule";
import { eventsMap } from "./createEventsMap";

export default function (weekdayMoment: moment.Moment, dateFormat = "DD-MM-YYYY"): _Event[] {
    const weekDay = weekdayMoment.clone().isoWeekday()
    const weekDayDate = weekdayMoment.clone().format(dateFormat)

    let events: _Event[] = eventsMap.get(weekDay) || []

    if (eventsMap.has(weekDayDate))
        events = [...events, ...eventsMap.get(weekDayDate)!];
    return events
}