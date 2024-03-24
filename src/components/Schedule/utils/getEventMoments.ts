import moment from "moment";
import { EventMoments, _Event } from "../../types.schedule";
import crossesDays from "./crossesDays";

export default function (event: _Event, weekdayMoment: moment.Moment): EventMoments {
    const isWeekly = event.start.day != undefined
    const startMoment = getMoment(weekdayMoment.clone(), event.start.time)
    const endMoment = getMoment(weekdayMoment.clone(), event.end.time)
    if (endMoment.isSameOrBefore(startMoment)) endMoment.set("days", startMoment.day() + 1)
    return { isWeekly, startMoment, endMoment, _id: event._id, excludedDays: event.excludedDays }
}

const getMoment = (weekDayDate: moment.Moment, startTime: string) => {
    return weekDayDate.clone().set('hour', parseInt(startTime.split(':')[0])).set('minute', parseInt(startTime.split(':')[1]))
}

export { getMoment }