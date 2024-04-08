type _State = {
    device_connected: boolean
    schedule_enabled: boolean
    relais_state: Relais_State
    relais_forced_on_until: {
        time: string
        day: number
    }
}

type Relais_State = "on" | "forced_on" | "off" | "unknown"