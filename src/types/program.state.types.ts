import { _Event } from "./schedule.types";

type EventPriority = "High" | "Medium"

type OneTimeEvent = {}

type Status = "pending" | "running" | "ignored" | "failed" | "interrupted" | "last_run" | "undefined"

export type ProgramStatus = {
    id: string | undefined
    state: Status 
    message?: string
}

type Jobs = "turn_on" | "turn_off" | "interrupt_event"

type ScheduleState = {
    enabled: boolean
}