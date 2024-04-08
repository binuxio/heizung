import { _Event } from "./schedule.types";

type EventPriority = "High" | "Medium"

type OneTimeEvent = {}

type CurrentEventState = "pending" | "running" | "ignored" | "failed" | "interrupted" | "last_run"

export type CurrentEvent = {
    id: string
    state: CurrentEventState
    event: Omit<_Event, "id">
}

type NextEvent = CurrentEvent & { state: Omit<CurrentEventState, "running" | "failed"> } // hmmmmmm

type Jobs = "turn_on" | "turn_off" | "interrupt_event"

type ScheduleState = {
    enabled: boolean

}