import moment from "moment";
import { EventDetails, _Event } from "../../types";
import getStartTimeMoment from "./getStartTimeMoment";

export default function (event: _Event, weekdayMoment: moment.Moment): EventDetails | undefined {
    if (!event) return undefined
    const isWeekly = event.start.day != undefined
    const startMoment = getStartTimeMoment(weekdayMoment.clone(), event.start.time)
    const durationMoment = moment.duration(event.duration).clone();
    const endMoment = startMoment.clone().add(durationMoment);

    return { isWeekly, startMoment, endMoment }
}