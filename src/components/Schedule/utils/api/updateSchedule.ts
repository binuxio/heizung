import moment from "moment";
import { EventMoments } from "../../../types.schedule";
import getEventsFromMap from "../getEventsFromMap";
import revert from "../revert";
import createEventsMap, { eventsMap } from "../createEventsMap";
import axios, { AxiosError } from "axios"

type PromiseResponse = { status: number, error?: string }
export default async function (removedEvents: string[], newEventsMoment: EventMoments[], weekDayDate: string): Promise<PromiseResponse> {
    const newEvents = revert(newEventsMoment)
    console.log(newEvents)
    const url = "http://192.168.178.64:6500/updateSchedule"
    let response: PromiseResponse = { status: 200 }
    try {
        const res = await axios.post(url, {
            removedEvents: removedEvents,
            newEvents: newEvents,
        });
    } catch (e) {
        const err = e as AxiosError
        console.error("Error updating schedule:", err);
        if (err.code === 'ECONNABORTED') {
            response = { status: 500, error: 'Server timed out' };
        } else if (err.response) {
            response = { status: err.response.status, error: err };
        } else {
            response = { status: 500, error: 'Internal server error' };
        }
    }

    if (response.status == 200) {
        const weekDayDateMoment = moment(weekDayDate)
        const day = weekDayDateMoment.isoWeekday()
        const date = weekDayDateMoment.format("DD-MM-YYYY")
        const weeklyEvents = newEvents.filter(event => event.isWeekly)
        const notWeeklyEvents = newEvents.filter(event => !event.isWeekly)
        eventsMap.delete(day)
        eventsMap.delete(date)
        weeklyEvents.length != 0 && eventsMap.set(day, weeklyEvents)
        notWeeklyEvents.length != 0 && eventsMap.set(day, notWeeklyEvents)
    }

    return response
}