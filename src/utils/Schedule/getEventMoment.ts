import moment from "moment";
import { EventMoment, _Event } from "../../types/schedule.types";

// moment.defineLocale("de", { week: { dow: 2, doy: 2 } })
// moment.locale("de", { week: { dow: 0, doy: 1 } })

export default function (event: _Event): EventMoment {
    const { start, end } = event
    const startMoment = getMoment(start.time, start.day)
    const endMoment = getMoment(end.time, start.day)
    if (endMoment.isSameOrBefore(startMoment)) endMoment.set("days", startMoment.day() + 1)
    return { startMoment, endMoment, id: event.id }
}

const getMoment = (time: string, day: number) => {
    const [h, m] = time.split(':');
    return moment().set('hour', parseInt(h)).set('minute', parseInt(m)).set("isoWeekday", day)
}
