import moment from "moment";

export default function (startMoment: moment.Moment, endMoment: moment.Moment): boolean {
    return startMoment.clone().format('YYYY-MM-DD') !== endMoment.clone().format('YYYY-MM-DD')
}