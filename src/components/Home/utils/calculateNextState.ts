import moment from "moment";
import getEventsFromMap from "../../Schedule/utils/getEventsFromMap";
import timeIsSameOrBefore from "../../Schedule/utils/timeIsSameOrBefore";

export default function () {
    const todayMoment = moment()
    const todayMomentTime = todayMoment.format("")
    const todayEvents = getEventsFromMap(todayMoment)
    let nextEvent = undefined
    if (todayEvents.length != 0) {
        let lastEvent = undefined
        for (let i = 0; i < todayEvents.length; i++) {
            const time = todayEvents[i].start.time.split(":")
            const eventsTimeMoment = moment().set("hours", parseInt(time[0])).set("minutes", parseInt(time[1]))
            console.log(timeIsSameOrBefore(todayMoment, eventsTimeMoment), todayEvents[i])
            
        }
    }
}