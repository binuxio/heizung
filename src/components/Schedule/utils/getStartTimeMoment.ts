import moment from "moment";

export default function (weekDayDate: moment.Moment, startTime: string) {
    return weekDayDate.clone().set('hour', parseInt(startTime.split(':')[0])).set('minute', parseInt(startTime.split(':')[1]))
}