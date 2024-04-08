import moment from "moment";

/**
 *  
 **/
export default function (time1: string, time2: string) {
    const [h1, min1] = time1.split(":")
    const time1Hour = parseInt(h1)
    const time1Minute = parseInt(min1)
    const [h2, min2] = time1.split(":")
    const endHour = parseInt(h2)
    const endMinute = parseInt(min2)

    if (time1Hour > endHour)
        return time1
    else if (time1Hour === endHour && time1Minute >= endMinute)
        return true
    else
        return false

    /* const now = moment()
    const time1Hour = parseInt(time1.split(":")[0])
    const time1Minute = parseInt(time1.split(":")[1])
    const time2Hour = parseInt(time2.split(":")[0])
    const time2Minute = parseInt(time2.split(":")[1])

    const time1Moment = now.clone().set("hours", time1Hour).set("minutes", time1Minute)
    const time2Moment = now.clone().set("hours", time2Hour).set("minutes", time2Minute)

    if (time1Moment.isSameOrBefore(time2Moment))
        return time1 */

}