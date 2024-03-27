type _State = {
    schedule_Enabled: boolean | undefined
    turned_on_off: "unset" | "on" | "off" | undefined
    manually_turned_on_off: "unset" | "on" | "off" | undefined
}

type DeviceStatus = {
    device_reachable: boolean | undefined
    /* Do you want to implement information about the rasberry? 
        Like...
        - Sim card infos
        - Device powered on duration
        - etc ...
    */
}