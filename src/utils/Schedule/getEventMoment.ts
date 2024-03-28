import moment from "moment";
import { EventMoment, _Event } from "../../types/schedule.types";

export default function (event: _Event): EventMoment {
    const startMoment = getMoment(event.start.time)
    const endMoment = getMoment(event.end.time)
    if (endMoment.isSameOrBefore(startMoment)) endMoment.set("days", startMoment.day() + 1)
    return { startMoment, endMoment, id: event.id }
}

const getMoment = (time: string) => {
    const [h, m] = time.split(':')
    return moment().set('hour', parseInt(h)).set('minute', parseInt(m))
}