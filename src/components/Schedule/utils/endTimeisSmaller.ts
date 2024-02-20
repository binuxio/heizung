import moment from "moment";

export default function (startMoment: moment.Moment, endMoment: moment.Moment): boolean {
    const startHours = startMoment.clone().hours()
    const endHours = endMoment.clone().hours()
    if (endHours < startHours)
        return true
    if (endMoment.clone().minutes() < startMoment.clone().minutes())
        return true
    return false
}