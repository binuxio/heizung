import axios from "axios"
import errorHandler from "./errorHandler";
import { serverURL } from "./env";
import { RequestReturn } from "./types";
import revert from "../Schedule/utils/revert";
import { EventMoments } from "../types.schedule";


export default async function (removedEvents: string[], newEventsMoment: EventMoments[], weekDayDate: string): Promise<RequestReturn> {
    const newEvents = revert(newEventsMoment)
    try {
        const res = await axios.post(serverURL + "/updateSchedule", {
            removedEvents: removedEvents,
            newEvents: newEvents,
        }, { timeout: 10000 })
        return { status: 200 }
    } catch (error: any) {
        return errorHandler(error)
    }

    // if (response.status == 200) {
    //     const weekDayDateMoment = moment(weekDayDate)
    //     const day = weekDayDateMoment.isoWeekday()
    //     const date = weekDayDateMoment.format("DD-MM-YYYY")
    //     const weeklyEvents = newEvents.filter(event => event.isWeekly)
    //     const notWeeklyEvents = newEvents.filter(event => !event.isWeekly)
    //     eventsMap.delete(day)
    //     eventsMap.delete(date)
    //     weeklyEvents.length != 0 && eventsMap.set(day, weeklyEvents)
    //     notWeeklyEvents.length != 0 && eventsMap.set(day, notWeeklyEvents)
    // }
}