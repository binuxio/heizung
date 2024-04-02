import { _socket } from "@/dotenv";

type Command = "get:relais-state" | "update-schedule" | "enable-schedule" | "disable-schedule" | "force-relais-off" | "force-relais-on"

export default function (command: Command, data: undefined | any = undefined) {
    if (_socket) {
        if (data)
            _socket.emit(command, data)
        else
            _socket.emit(command)
    }
}