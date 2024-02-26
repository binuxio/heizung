import moment from "moment";

/**
 * 
 * @param startMoment 
 * @param endMoment - do not clone
 */
export default function (startMoment: moment.Moment, endMoment: moment.Moment): boolean {
    const crossesDay = endMoment.isSameOrBefore(startMoment)
    if (crossesDay) endMoment.add(1, "days")
    return crossesDay
}