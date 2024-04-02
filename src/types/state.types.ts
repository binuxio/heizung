type _State = {
    device_connected: boolean
    schedule_version_id: number
    schedule_enabled: boolean
    Event_state: Event_State
    relais_state: Relais_State
}

type Relais_State = "on" | "forced_on" | "off" | "unknown"
type Event_State = {
    state: Relais_State
    eventID?: string
    nextEventState?: {
        eventID: string
        state: Relais_State,
        time: string
    }
}