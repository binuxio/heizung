import { Job, RecurrenceRule } from "node-schedule"
import nodeScheduler from "../nodeScheduler"
import moment from "moment"

export const getRecurrenceRule = (date: { time: string, day: number }): RecurrenceRule => {
    const { day, time } = date
    const Rule = new nodeScheduler.RecurrenceRule()
    const [Hour, Minute] = time.split(":")
    Rule.hour = parseInt(Hour)
    Rule.minute = parseInt(Minute)
    Rule.dayOfWeek = day
    return Rule
}

export const getScheduledDate = (date: { time: string, day: number }): Date => {
    const { day, time } = date
    const endJobTime = moment()
    const [Hour, Minute] = time.split(":")
    endJobTime.set("hours", parseInt(Hour))
    endJobTime.set("minutes", parseInt(Minute))
    endJobTime.set("day", day)
    endJobTime.set("seconds", 0)
    return endJobTime.toDate()
}