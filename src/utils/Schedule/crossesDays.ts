import moment from "moment";

/**
 * 
 * @param startMoment 
 * @param endMoment - do not clone
 */
export default function (startMoment: moment.Moment, endMoment: moment.Moment): boolean {
    const crossesDay = endMoment.isSameOrBefore(startMoment)
    return crossesDay
}